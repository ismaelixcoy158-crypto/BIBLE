#!/usr/bin/env bash
set -e

SDK_DIR="/home/ismadev/Android/Sdk"
BUILD_TOOLS="$SDK_DIR/build-tools/36.0.0"
PLATFORM="$SDK_DIR/platforms/android-36/android.jar"
ROOT_DIR="/home/ismadev/Escritorio/BIBLE/android-build"

echo "=== 1. Preparando directorios del proyecto Android ==="
rm -rf "$ROOT_DIR/app"
mkdir -p "$ROOT_DIR/app/src/com/ixcoydev/biblecontrol"
mkdir -p "$ROOT_DIR/app/res/values"
mkdir -p "$ROOT_DIR/app/res/layout"
mkdir -p "$ROOT_DIR/app/res/mipmap-mdpi"
mkdir -p "$ROOT_DIR/app/res/mipmap-hdpi"
mkdir -p "$ROOT_DIR/app/res/mipmap-xhdpi"
mkdir -p "$ROOT_DIR/app/res/mipmap-xxhdpi"
mkdir -p "$ROOT_DIR/app/res/mipmap-xxxhdpi"
mkdir -p "$ROOT_DIR/app/obj"
mkdir -p "$ROOT_DIR/app/bin"
mkdir -p "$ROOT_DIR/output"

echo "=== 2. Generando iconos oficiales para Android ==="
LOGO_SRC="/home/ismadev/Escritorio/BIBLE/src/renderer/shared/assets/bible-logo.png"
convert "$LOGO_SRC" -resize 48x48 "$ROOT_DIR/app/res/mipmap-mdpi/ic_launcher.png"
convert "$LOGO_SRC" -resize 72x72 "$ROOT_DIR/app/res/mipmap-hdpi/ic_launcher.png"
convert "$LOGO_SRC" -resize 96x96 "$ROOT_DIR/app/res/mipmap-xhdpi/ic_launcher.png"
convert "$LOGO_SRC" -resize 144x144 "$ROOT_DIR/app/res/mipmap-xxhdpi/ic_launcher.png"
convert "$LOGO_SRC" -resize 192x192 "$ROOT_DIR/app/res/mipmap-xxxhdpi/ic_launcher.png"

echo "=== 3. Creando AndroidManifest.xml y recursos ==="
cat << 'EOF' > "$ROOT_DIR/app/AndroidManifest.xml"
<?xml version="1.0" encoding="utf-8"?>
<manifest xmlns:android="http://schemas.android.com/apk/res/android"
    package="com.ixcoydev.biblecontrol"
    android:versionCode="1"
    android:versionName="1.0.0">

    <uses-sdk android:minSdkVersion="21" android:targetSdkVersion="34" />

    <uses-permission android:name="android.permission.INTERNET" />
    <uses-permission android:name="android.permission.ACCESS_NETWORK_STATE" />
    <uses-permission android:name="android.permission.ACCESS_WIFI_STATE" />
    <uses-permission android:name="android.permission.VIBRATE" />

    <application
        android:label="@string/app_name"
        android:icon="@mipmap/ic_launcher"
        android:theme="@android:style/Theme.NoTitleBar.Fullscreen"
        android:usesCleartextTraffic="true"
        android:hardwareAccelerated="true">
        <activity
            android:name=".MainActivity"
            android:exported="true"
            android:configChanges="orientation|screenSize|keyboardHidden"
            android:windowSoftInputMode="adjustResize">
            <intent-filter>
                <action android:name="android.intent.action.MAIN" />
                <category android:name="android.intent.category.LAUNCHER" />
            </intent-filter>
        </activity>
    </application>
</manifest>
EOF

cat << 'EOF' > "$ROOT_DIR/app/res/values/strings.xml"
<?xml version="1.0" encoding="utf-8"?>
<resources>
    <string name="app_name">BIBLE Control</string>
</resources>
EOF

cat << 'EOF' > "$ROOT_DIR/app/src/com/ixcoydev/biblecontrol/MainActivity.java"
package com.ixcoydev.biblecontrol;

import android.app.Activity;
import android.app.AlertDialog;
import android.content.Context;
import android.content.DialogInterface;
import android.content.SharedPreferences;
import android.os.Bundle;
import android.os.Vibrator;
import android.view.View;
import android.view.ViewGroup;
import android.webkit.JavascriptInterface;
import android.webkit.WebChromeClient;
import android.webkit.WebResourceError;
import android.webkit.WebResourceRequest;
import android.webkit.WebSettings;
import android.webkit.WebView;
import android.webkit.WebViewClient;
import android.widget.Button;
import android.widget.EditText;
import android.widget.FrameLayout;
import android.widget.LinearLayout;
import android.widget.TextView;
import android.widget.Toast;

public class MainActivity extends Activity {
    private WebView webView;
    private FrameLayout rootLayout;
    private LinearLayout errorView;
    private TextView errorText;
    private SharedPreferences prefs;
    private static final String PREF_SERVER_URL = "server_url";
    private static final String DEFAULT_URL = "http://192.168.1.45:4545";

    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        prefs = getSharedPreferences("bible_prefs", Context.MODE_PRIVATE);

        rootLayout = new FrameLayout(this);
        rootLayout.setLayoutParams(new ViewGroup.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ));
        rootLayout.setBackgroundColor(0xFF0F172A);

        // 1. Configurar WebView
        webView = new WebView(this);
        webView.setLayoutParams(new FrameLayout.LayoutParams(
            ViewGroup.LayoutParams.MATCH_PARENT,
            ViewGroup.LayoutParams.MATCH_PARENT
        ));
        webView.setBackgroundColor(0xFF0F172A);

        WebSettings settings = webView.getSettings();
        settings.setJavaScriptEnabled(true);
        settings.setDomStorageEnabled(true);
        settings.setDatabaseEnabled(true);
        settings.setAllowFileAccess(true);
        settings.setAllowContentAccess(true);
        settings.setUseWideViewPort(true);
        settings.setLoadWithOverviewMode(true);
        settings.setMixedContentMode(WebSettings.MIXED_CONTENT_ALWAYS_ALLOW);

        // Puente JavaScript para vibración nativa
        webView.addJavascriptInterface(new Object() {
            @JavascriptInterface
            public void vibrate(long milliseconds) {
                Vibrator v = (Vibrator) getSystemService(Context.VIBRATOR_SERVICE);
                if (v != null) {
                    v.vibrate(milliseconds > 0 ? milliseconds : 40);
                }
            }
        }, "AndroidNative");

        webView.setWebChromeClient(new WebChromeClient());
        webView.setWebViewClient(new WebViewClient() {
            @Override
            public void onReceivedError(WebView view, WebResourceRequest request, WebResourceError error) {
                if (request.isForMainFrame()) {
                    showErrorScreen("No se pudo conectar con la computadora de proyección.\nVerifica que el teléfono esté conectado a la misma red Wi-Fi.");
                }
            }

            @Override
            public void onPageFinished(WebView view, String url) {
                hideErrorScreen();
            }
        });

        rootLayout.addView(webView);

        // 2. Botón flotante para cambiar IP del Servidor
        Button btnSettings = new Button(this);
        btnSettings.setText("⚙ IP");
        btnSettings.setTextSize(11);
        btnSettings.setTextColor(0xFF94A3B8);
        btnSettings.setBackgroundColor(0x331E293B);
        FrameLayout.LayoutParams btnParams = new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.WRAP_CONTENT,
            FrameLayout.LayoutParams.WRAP_CONTENT
        );
        btnParams.gravity = android.view.Gravity.TOP | android.view.Gravity.END;
        btnParams.setMargins(0, 16, 16, 0);
        btnSettings.setLayoutParams(btnParams);
        btnSettings.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showServerUrlDialog();
            }
        });
        rootLayout.addView(btnSettings);

        // 3. Pantalla de error amigable cuando la compu está apagada o la IP cambió
        createErrorView();
        rootLayout.addView(errorView);

        setContentView(rootLayout);

        // Cargar URL guardada
        loadCurrentServerUrl();
    }

    private void loadCurrentServerUrl() {
        String url = prefs.getString(PREF_SERVER_URL, DEFAULT_URL);
        if (!url.startsWith("http://") && !url.startsWith("https://")) {
            url = "http://" + url;
        }
        hideErrorScreen();
        webView.loadUrl(url);
    }

    private void showServerUrlDialog() {
        AlertDialog.Builder builder = new AlertDialog.Builder(this);
        builder.setTitle("Dirección de la Computadora");
        builder.setMessage("Ingresa la IP y puerto que muestra la pantalla de BIBLE (ej: 192.168.1.45:4545):");

        final EditText input = new EditText(this);
        input.setSingleLine(true);
        input.setText(prefs.getString(PREF_SERVER_URL, DEFAULT_URL));
        builder.setView(input);

        builder.setPositiveButton("Conectar", new DialogInterface.OnClickListener() {
            @Override
            public void onClick(DialogInterface dialog, int which) {
                String newUrl = input.getText().toString().trim();
                if (!newUrl.isEmpty()) {
                    prefs.edit().putString(PREF_SERVER_URL, newUrl).apply();
                    loadCurrentServerUrl();
                    Toast.makeText(MainActivity.this, "Conectando a " + newUrl, Toast.LENGTH_SHORT).show();
                }
            }
        });

        builder.setNegativeButton("Cancelar", null);
        builder.show();
    }

    private void createErrorView() {
        errorView = new LinearLayout(this);
        errorView.setOrientation(LinearLayout.VERTICAL);
        errorView.setGravity(android.view.Gravity.CENTER);
        errorView.setBackgroundColor(0xFF0F172A);
        errorView.setPadding(40, 40, 40, 40);
        FrameLayout.LayoutParams params = new FrameLayout.LayoutParams(
            FrameLayout.LayoutParams.MATCH_PARENT,
            FrameLayout.LayoutParams.MATCH_PARENT
        );
        errorView.setLayoutParams(params);
        errorView.setVisibility(View.GONE);

        TextView title = new TextView(this);
        title.setText("BIBLE Control");
        title.setTextSize(22);
        title.setTextColor(0xFF38BDF8);
        title.setGravity(android.view.Gravity.CENTER);
        errorView.addView(title);

        errorText = new TextView(this);
        errorText.setTextSize(14);
        errorText.setTextColor(0xFFCBD5E1);
        errorText.setGravity(android.view.Gravity.CENTER);
        errorText.setPadding(0, 20, 0, 30);
        errorView.addView(errorText);

        Button btnRetry = new Button(this);
        btnRetry.setText("Reintentar Conexión");
        btnRetry.setBackgroundColor(0xFF0284C7);
        btnRetry.setTextColor(0xFFFFFFFF);
        btnRetry.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                loadCurrentServerUrl();
            }
        });
        errorView.addView(btnRetry);

        Button btnChangeIp = new Button(this);
        btnChangeIp.setText("Cambiar IP de la Computadora");
        btnChangeIp.setBackgroundColor(0xFF1E293B);
        btnChangeIp.setTextColor(0xFF94A3B8);
        LinearLayout.LayoutParams p = new LinearLayout.LayoutParams(
            LinearLayout.LayoutParams.WRAP_CONTENT,
            LinearLayout.LayoutParams.WRAP_CONTENT
        );
        p.setMargins(0, 20, 0, 0);
        btnChangeIp.setLayoutParams(p);
        btnChangeIp.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View v) {
                showServerUrlDialog();
            }
        });
        errorView.addView(btnChangeIp);
    }

    private void showErrorScreen(String message) {
        errorText.setText(message);
        errorView.setVisibility(View.VISIBLE);
        webView.setVisibility(View.GONE);
    }

    private void hideErrorScreen() {
        errorView.setVisibility(View.GONE);
        webView.setVisibility(View.VISIBLE);
    }

    @Override
    public void onBackPressed() {
        if (webView.canGoBack()) {
            webView.goBack();
        } else {
            super.onBackPressed();
        }
    }
}
EOF

echo "=== 4. Compilando recursos con aapt2 ==="
"$BUILD_TOOLS/aapt2" compile --dir "$ROOT_DIR/app/res" -o "$ROOT_DIR/compiled_res.zip"
"$BUILD_TOOLS/aapt2" link \
    -I "$PLATFORM" \
    --manifest "$ROOT_DIR/app/AndroidManifest.xml" \
    -o "$ROOT_DIR/app_unaligned.apk" \
    "$ROOT_DIR/compiled_res.zip" \
    --java "$ROOT_DIR/app/src"

echo "=== 5. Compilando código Java con javac ==="
javac -encoding UTF-8 -cp "$PLATFORM" \
    -d "$ROOT_DIR/app/obj" \
    "$ROOT_DIR/app/src/com/ixcoydev/biblecontrol/"*.java

echo "=== 6. Convirtiendo bytecode a Dalvik DEX con d8 ==="
"$BUILD_TOOLS/d8" \
    --lib "$PLATFORM" \
    --output "$ROOT_DIR/app/bin" \
    "$ROOT_DIR/app/obj/com/ixcoydev/biblecontrol/"*.class

echo "=== 7. Empaquetando classes.dex en el APK ==="
cd "$ROOT_DIR/app/bin"
zip -u "$ROOT_DIR/app_unaligned.apk" classes.dex
cd "$ROOT_DIR"

echo "=== 8. Alineando APK con zipalign ==="
"$BUILD_TOOLS/zipalign" -p -f -v 4 "$ROOT_DIR/app_unaligned.apk" "$ROOT_DIR/app_aligned.apk" > /dev/null

echo "=== 9. Generando Keystore y firmando APK con apksigner ==="
KEYSTORE="$ROOT_DIR/bible-release.keystore"
if [ ! -f "$KEYSTORE" ]; then
    keytool -genkey -v -keystore "$KEYSTORE" \
        -alias biblekey \
        -keyalg RSA -keysize 2048 -validity 10000 \
        -storepass bible1234 -keypass bible1234 \
        -dname "CN=Ixcoydev, OU=BIBLE, O=Proyect Ixcoydev, L=Guatemala, ST=Guatemala, C=GT"
fi

FINAL_APK="/home/ismadev/Escritorio/BIBLE/src/main/services/downloads/bible-control.apk"
mkdir -p "$(dirname "$FINAL_APK")"

"$BUILD_TOOLS/apksigner" sign \
    --ks "$KEYSTORE" \
    --ks-pass pass:bible1234 \
    --key-pass pass:bible1234 \
    --ks-key-alias biblekey \
    --out "$FINAL_APK" \
    "$ROOT_DIR/app_aligned.apk"

echo "=== 10. Verificando firma del APK ==="
"$BUILD_TOOLS/apksigner" verify "$FINAL_APK"

echo "=========================================================="
echo "¡APK GENERADO CON ÉXITO!"
echo "Ruta final: $FINAL_APK"
ls -lh "$FINAL_APK"
echo "=========================================================="

