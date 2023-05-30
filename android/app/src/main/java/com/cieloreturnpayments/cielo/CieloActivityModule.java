package com.cieloreturnpayments.cielo;

import android.util.Base64;
import android.os.Build;
import android.os.Looper;
import android.app.Activity;
import android.content.Intent;
import android.content.Context;
import android.content.SharedPreferences;
import android.net.Uri;

import androidx.annotation.NonNull;

import com.facebook.react.bridge.ActivityEventListener;
import com.facebook.react.bridge.BaseActivityEventListener;


import com.facebook.react.bridge.ReactApplicationContext;
import com.facebook.react.bridge.ReactContextBaseJavaModule;
import com.facebook.react.bridge.ReactMethod;
import com.facebook.react.bridge.Promise;
import com.facebook.react.bridge.Callback;

import androidx.annotation.RequiresApi;
import java.nio.charset.StandardCharsets;

public class CieloActivityModule extends ReactContextBaseJavaModule  {

    private static final int CIELO_REQUEST = 1;
    private static final String THERE_IS_NO_ACTIVITY = "THERE_IS_NO_ACTIVITY";
    private static final String ERROR_ARRIVE_RESULT = "ERROR_ARRIVE_RESULT";
    private static final String ERROR_AFTER_RECEIVING_RESULT = "ERROR_AFTER_RECEIVING_RESULT";

    private String textResult;
    ReactApplicationContext context;

    private Promise mCieloPromise;

    private final ActivityEventListener mActivityEventListener = new BaseActivityEventListener() {

        @Override
        public void onActivityResult(Activity activity, int requestCode, int resultCode, Intent intent) {
            if (requestCode == CIELO_REQUEST) {
                if (mCieloPromise != null) {
                    mCieloPromise.resolve("Esse resultado foi realizado com sucesso");
                } else {
                    mCieloPromise.reject(ERROR_AFTER_RECEIVING_RESULT, "Tem um problema com o recurso de receber resultado");
                }
            }
            mCieloPromise = null;
        }
    };

    public CieloActivityModule(ReactApplicationContext reactContext) {
		super(reactContext);
		context = reactContext;
        reactContext.addActivityEventListener(mActivityEventListener);
	}

    @NonNull
    @Override 
    public String getName() {
        return "CieloActivity";
    }

    @ReactMethod
    public void cieloPayment(final String url, final Promise promise) {
        
        Activity activity = getCurrentActivity();

        if (activity == null) {
            promise.reject(THERE_IS_NO_ACTIVITY, "Nao existe nenhuma atividade!");
            return;
        }

        mCieloPromise = promise;

        try {
            new android.os.Handler(Looper.getMainLooper()).postDelayed(
                () -> { 
                    Intent intent = new Intent(Intent.ACTION_VIEW, Uri.parse(url));
                    intent.addFlags(Intent.FLAG_ACTIVITY_CLEAR_TOP);
                    activity.startActivityForResult(intent, CIELO_REQUEST);
                },
            1000);
        } catch (Exception e) {
            String err = String.valueOf(e);
            mCieloPromise.reject(ERROR_AFTER_RECEIVING_RESULT, err);
            mCieloPromise = null;
        }
    }

    @ReactMethod
    public void cieloResult(final Promise promiseResult) {
        SharedPreferences sharedPreferences = context.getSharedPreferences("cieloResult", Context.MODE_PRIVATE);
        textResult  = sharedPreferences.getString("text", "");
        
        if (textResult != null ) {
            promiseResult.resolve(textResult);
        } else {
            promiseResult.reject(ERROR_ARRIVE_RESULT, "Ocorreu erro ao chegar resultado");
        }
    }
}
