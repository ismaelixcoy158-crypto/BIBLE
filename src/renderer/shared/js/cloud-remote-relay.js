/**
 * BIBLE — CloudRemoteRelay
 * Conexión en tiempo real vía WebSockets seguros (WSS / MQTT) para control remoto universal.
 * Permite que cualquier celular (Android o iPhone) controle la proyección desde el púlpito
 * sin requerir la misma red Wi-Fi y asegurado mediante Código de Sala (Room ID) único.
 */

export class CloudRemoteRelay {
  constructor() {
    this.client = null;
    this.roomId = null;
    this.pin = '1234';
    this.isConnected = false;
    this.isConnecting = false;
    this.reconnectTimer = null;
    this.heartbeatTimer = null;
    this.lastState = null;

    // Brokers públicos de alta disponibilidad WSS (HTTPS WebSockets)
    // Prioridad EMQX (conexión ultrarrápida sin problemas de enrutamiento IPv6)
    this.brokers = [
      { name: 'EMQX', host: 'broker.emqx.io', port: 8084, path: '/mqtt' },
      { name: 'HiveMQ', host: 'broker.hivemq.com', port: 8884, path: '/mqtt' }
    ];
    this.currentBrokerIdx = 0;
  }

  /**
   * Inicializa la conexión en la nube para la laptop
   */
  async init() {
    if (!window.Paho || !window.Paho.MQTT) {
      console.warn('[CloudRemoteRelay] Librería Paho MQTT no disponible en window.');
      return;
    }

    try {
      const status = await window.bibleAPI.control.getStatus();
      if (status) {
        this.roomId = status.roomId || 'BIB-7842';
        this.pin = status.pin || '1234';
      }
    } catch (err) {
      console.warn('[CloudRemoteRelay] Error al consultar status inicial:', err);
      this.roomId = 'BIB-7842';
    }

    // Escuchar actualizaciones de PIN o Sala en caliente
    window.addEventListener('control:pin-updated', (e) => {
      if (e.detail?.pin) this.pin = String(e.detail.pin).trim();
    });

    window.addEventListener('control:room-updated', async (e) => {
      if (e.detail?.roomId) {
        this.roomId = String(e.detail.roomId).trim().toUpperCase();
      }
      if (e.detail?.pin) {
        this.pin = String(e.detail.pin).trim();
      }
      this.reconnect();
    });

    // Escuchar cambios de proyección para sincronizar la pantalla del celular
    if (window.bibleAPI?.projection?.onPreviewUpdate) {
      window.bibleAPI.projection.onPreviewUpdate((state) => {
        this.lastState = state;
        if (this.isConnected) {
          this.broadcastCurrentState();
        }
      });
    }

    this.connect();
  }

  /**
   * Conecta con el broker activo
   */
  connect() {
    if (this.isConnected || this.isConnecting) return;
    if (!this.roomId) return;

    this.isConnecting = true;
    const broker = this.brokers[this.currentBrokerIdx];
    const clientId = `bible-laptop-${this.roomId}-${Math.random().toString(36).substring(2, 6)}`;

    try {
      this.client = new window.Paho.MQTT.Client(broker.host, broker.port, broker.path, clientId);

      this.client.onConnectionLost = (resp) => {
        console.warn(`[CloudRemoteRelay] Conexión perdida con ${broker.name}:`, resp.errorMessage);
        this.isConnected = false;
        this.isConnecting = false;
        this.notifyStatus(false);
        this.scheduleReconnect();
      };

      this.client.onMessageArrived = (msg) => {
        this.handleIncomingCommand(msg.payloadString);
      };

      this.client.connect({
        useSSL: true,
        timeout: 6,
        cleanSession: true,
        keepAliveInterval: 30,
        onSuccess: () => {
          this.isConnected = true;
          this.isConnecting = false;
          console.log(`[CloudRemoteRelay] Conectado exitosamente a ${broker.name} WSS (Sala: ${this.roomId})`);
          this.notifyStatus(true, broker.name);

          // Suscribirse a órdenes remotas para esta sala
          const cmdTopic = `bible/room/${this.roomId}/cmd`;
          this.client.subscribe(cmdTopic, { qos: 0 });

          // Anunciar presencia inmediata de la laptop en la sala
          this.publishResponse({
            type: 'presence',
            roomId: this.roomId,
            online: true,
            timestamp: Date.now()
          });

          // Transmitir estado actual inicial de la laptop
          this.broadcastCurrentState();

          // Iniciar latido periódico cada 12s
          this.startHeartbeat();
        },
        onFailure: (err) => {
          console.warn(`[CloudRemoteRelay] Falló conexión con ${broker.name}:`, err?.errorMessage || err);
          this.isConnected = false;
          this.isConnecting = false;
          this.notifyStatus(false);
          // Alternar al siguiente broker (ej. EMQX si falla HiveMQ)
          this.currentBrokerIdx = (this.currentBrokerIdx + 1) % this.brokers.length;
          this.scheduleReconnect(3000);
        }
      });
    } catch (err) {
      console.warn('[CloudRemoteRelay] Error al instanciar cliente MQTT:', err);
      this.isConnecting = false;
      this.scheduleReconnect(5000);
    }
  }

  scheduleReconnect(delay = 4000) {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    this.reconnectTimer = setTimeout(() => {
      this.connect();
    }, delay);
  }

  reconnect() {
    if (this.reconnectTimer) clearTimeout(this.reconnectTimer);
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    if (this.client) {
      try {
        this.client.disconnect();
      } catch (e) {}
      this.client = null;
    }
    this.isConnected = false;
    this.isConnecting = false;
    this.connect();
  }

  startHeartbeat() {
    if (this.heartbeatTimer) clearInterval(this.heartbeatTimer);
    this.heartbeatTimer = setInterval(() => {
      if (this.isConnected) {
        this.broadcastCurrentState();
      }
    }, 12000);
  }

  /**
   * Procesa comandos recibidos desde el celular del predicador / multimedia
   */
  async handleIncomingCommand(rawPayload) {
    let data = null;
    try {
      data = JSON.parse(rawPayload);
    } catch (e) {
      console.warn('[CloudRemoteRelay] Payload no es JSON válido:', rawPayload);
      return;
    }

    if (!data || !data.action) return;

    // Acción 'ping' para detección de laptop en vivo (no requiere PIN)
    if (data.action === 'ping') {
      console.log(`[CloudRemoteRelay] Ping recibido desde celular para sala: ${this.roomId}`);
      this.publishResponse({
        type: 'pong',
        roomId: this.roomId,
        online: true,
        timestamp: Date.now()
      });
      return;
    }

    // Verificar PIN de seguridad para todas las acciones protegidas
    const inputPin = String(data.pin || '').trim();
    let activePin = String(this.pin || '').trim();

    if (inputPin !== activePin) {
      try {
        const freshStatus = await window.bibleAPI.control.getStatus();
        if (freshStatus && freshStatus.pin) {
          this.pin = String(freshStatus.pin).trim();
          this.roomId = freshStatus.roomId || `BIB-${this.pin}`;
          activePin = this.pin;
        }
      } catch (e) {}
    }

    if (inputPin !== activePin) {
      console.warn('[CloudRemoteRelay] Intento de acceso remoto con PIN inválido:', inputPin, 'esperado:', activePin);
      this.publishResponse({
        type: 'auth_response',
        success: false,
        authenticated: false,
        error: 'PIN incorrecto. Verifica el PIN en la pantalla de la laptop.',
        timestamp: Date.now()
      });
      return;
    }

    // Acción especial 'auth': Solo autentica y devuelve el estado actual
    if (data.action === 'auth') {
      console.log('[CloudRemoteRelay] Celular autenticado con éxito en Sala:', this.roomId);
      await this.broadcastCurrentState({ authenticated: true });
      return;
    }

    // Ejecutar acción en BIBLE (avanzar, retroceder, pánico)
    console.log('[CloudRemoteRelay] Ejecutando orden remota:', data.action);
    try {
      if (window.bibleAPI?.control?.executeAction) {
        await window.bibleAPI.control.executeAction(data.action);
      }
    } catch (err) {
      console.warn('[CloudRemoteRelay] Error al ejecutar acción remota:', err);
    }

    // Emitir estado actualizado al celular con leve retardo para captura del DOM
    setTimeout(() => {
      this.broadcastCurrentState({ lastAction: data.action });
    }, 40);
  }

  /**
   * Transmite el estado actual completo de la proyección a la sala
   */
  async broadcastCurrentState(extra = {}) {
    if (!this.isConnected || !this.client || !this.roomId) return;

    let projState = null;
    if (window.bibleAPI?.projection?.getState) {
      try {
        projState = await window.bibleAPI.projection.getState();
        this.lastState = projState;
      } catch (e) {}
    }
    if (!projState) projState = this.lastState;

    let preachingState = null;
    try {
      const status = await window.bibleAPI.control.getStatus();
      preachingState = status?.preaching?.activePreaching || null;
    } catch (e) {}

    const payload = {
      type: 'state',
      roomId: this.roomId,
      timestamp: Date.now(),
      projection: {
        active: Boolean(projState?.active),
        title: projState?.title || '',
        text: projState?.text || '',
        reference: projState?.reference || '',
        currentSlide: projState?.currentSlide || 1,
        totalSlides: projState?.totalSlides || 1,
        isBlackout: Boolean(projState?.isBlackout),
        isLogo: Boolean(projState?.isLogo),
        isFrozen: Boolean(projState?.isFrozen),
        isClearText: Boolean(projState?.isClearText),
        activeModule: projState?.activeModule || 'bible'
      },
      preaching: preachingState,
      ...extra
    };

    this.publishResponse(payload);
  }

  publishResponse(payloadObj) {
    if (!this.isConnected || !this.client || !this.roomId) return;
    try {
      const topic = `bible/room/${this.roomId}/state`;
      const msg = new window.Paho.MQTT.Message(JSON.stringify(payloadObj));
      msg.destinationName = topic;
      msg.qos = 0;
      this.client.send(msg);
    } catch (err) {
      console.warn('[CloudRemoteRelay] Error al publicar respuesta:', err);
    }
  }

  notifyStatus(connected, brokerName = '') {
    window.dispatchEvent(new CustomEvent('cloud-relay:status', {
      detail: {
        connected,
        broker: brokerName || (this.brokers[this.currentBrokerIdx]?.name || 'Cloud Relay'),
        roomId: this.roomId
      }
    }));
  }
}

// Instancia única exportada
export const cloudRemoteRelay = new CloudRemoteRelay();

