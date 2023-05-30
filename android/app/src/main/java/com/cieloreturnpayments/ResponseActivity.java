package com.cieloreturnpayments;

import android.util.Base64;
import android.app.Activity;
import android.content.Intent;
import android.content.SharedPreferences;
import android.os.Build;
import android.os.Bundle;
import android.net.Uri;

import androidx.annotation.RequiresApi;
import java.nio.charset.StandardCharsets;

public class ResponseActivity extends Activity {

    Intent intentResponse;
    private String txtResult;
    private String text;

    public static final String CIELO_RESULT = "cieloResult";
    public static final String TEXT = "text";

    @RequiresApi(api = Build.VERSION_CODES.KITKAT)
    @Override
    protected void onCreate(Bundle savedInstanceState) {
        super.onCreate(savedInstanceState);

        intentResponse = getIntent();
        String action = intentResponse.getAction();

        if (action != null && action.equals(Intent.ACTION_VIEW)) {
            Uri uri = intentResponse.getData();
            String response = uri.getQueryParameter("response");
            byte[] data = Base64.decode(response, Base64.DEFAULT);
            txtResult = new String(data, StandardCharsets.UTF_8);
            saveData();

            Intent intentSendMsg = new Intent();
            intentSendMsg.putExtra("send_message", txtResult);
            setResult(Activity.RESULT_OK, intentSendMsg);
            finish();

        }
    }

     public void saveData() {
        SharedPreferences sharedPreferences = getSharedPreferences(CIELO_RESULT, MODE_PRIVATE);
        SharedPreferences.Editor editor = sharedPreferences.edit();

        editor.putString(TEXT, txtResult);

        editor.apply();
    }
}
