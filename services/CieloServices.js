import { Base64 } from './Base64Service';
import { NativeModules, Linking } from 'react-native';

const onPaymentRequestWithCielo = (tableNumber, value, form) => new Promise((resolve, reject) => {
    let jsonString = `{
        'accessToken': 'yourAccessToken',
        'clientID': 'yourClientId',
        'email': 'your.email@gmail.com',
        'installments': 0,
        'items': [{
            'name': ${ tableNumber.toString() },
            'quantity': 1,
            'sku': '00001',
            'unitOfMeasure': 'unidade',
            'unitPrice': ${ value }
        }],
        'paymentCode': ${ form },
        'value': '${ value.toString() }'
    }`;

    let jsonToBase64 = Base64.btoa(jsonString);

    setTimeout(async () => {
        let checkoutUri = `lio://payment?request=${jsonToBase64}&urlCallback=order://response`;

        await Linking.canOpenURL(checkoutUri)
                    .then(supported => !supported 
                                            ? reject('Não é possível abrir url: ' + checkoutUri)
                                            : NativeModules.CieloActivity.cieloPayment(checkoutUri)
                                                                            .then(() => resolve())
                                                                            .catch(err => reject('Mensagem de erro: ' + err))
                    )
                    .catch(err => reject('Erro ocorrido: ' + err) );

       }, 460);
});

const onSearchCieloResult = () => new Promise(async (resolve, reject) => {
    await NativeModules.CieloActivity.cieloResult()
                                    .then(resp => {
                                        const jsonObject = resp.replace(/[\\"]/g, '').replace(/,/g, '').replace(/:/g, '').replace(/description/g, '');
                                        const object = {};
                                        
                                        if (jsonObject.indexOf('cieloCode') >= 0) {
                                            const cieloCode     = jsonObject.slice(jsonObject.indexOf('cieloCode') + 9, jsonObject.indexOf('discountedAmount'));
                                            const brand         = jsonObject.slice(jsonObject.indexOf('brand') + 5, jsonObject.indexOf('cieloCode'));
                                            const authCode      = jsonObject.indexOf('authCode') > 1 
                                                                                ? jsonObject.slice(jsonObject.indexOf('authCode') + 8, jsonObject.indexOf('brand'))
                                                                                : null;
                                            const mask          = jsonObject.slice(jsonObject.indexOf('mask') + 4, jsonObject.indexOf('merchantCode'));
                                            const clientName    = jsonObject.indexOf('clientName') > 0 
                                                                                ? jsonObject.slice(jsonObject.indexOf('clientName') + 10, jsonObject.indexOf('upFrontAmount')) 
                                                                                : 'FULANES';
                                            const modalidade    = jsonObject.slice(jsonObject.indexOf('primaryProductName') + 18, jsonObject.indexOf('receiptPrintPermission'));

                                            object.cieloCode 	= cieloCode;
                                            object.brand 		= brand;
                                            object.authCode 	= authCode;
                                            object.mask 		= mask;
                                            object.clientName 	= clientName || 'FULANO';
                                            object.modalidade 	= modalidade;
                                        } else {
                                            const msnErr = jsonObject.slice(jsonObject.indexOf('reason') + 6, jsonObject.indexOf('}'));
                                            object.reason = msnErr;
                                        }
                                        setTimeout(() => {
                                            resolve(object);
                                        }, 110);
                                    })
                                    .catch(err => reject(err));
});
  
export { onPaymentRequestWithCielo, onSearchCieloResult };
