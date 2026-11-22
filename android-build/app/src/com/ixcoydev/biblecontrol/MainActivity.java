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
