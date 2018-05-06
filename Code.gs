function onSubmit(e) {
    var newEntry = e;
    if (!(newEntry && newEntry.namedValues)) {
      Logger.log("added form can`be readed");
      throw new Error('Ошибка при получении данных с формы');
    }
    var patientInfo = getValueFromJsonObjByKey(newEntry, 'namedValues');
    
    var patientStatus = getPatientStatus(patientInfo);
    var recipientPhone = getRelativePhone(patientInfo);
    
    if (patientStatus != 'Поступил') {
      return;
    }
    
    if (!recipientPhone) {
      return;
    }
    
    var msgDocId = '165i_cxxTrio8b0kaybznFAiJcELeeP4Y61YP3TQXPnc';
    var msg = getMessage(msgDocId);
    sendSms(recipientPhone, msg.messageBody);
    Logger.log('email was successfullly sended to the ' + recipientPhone);
    
  }
  
  //private sms
  function sendSms(phoneNumber, msgBody) {
    phoneNumber = parsePhoneNumber(phoneNumber);
    Logger.log("Starting sending a SMS to" + phoneNumber);
    var apiKey = '097f701cdf6e0e336fca5d6ba917d52cdbbdfeb2';
    var msgUrl = 'https://api.mobizon.ua/service/message/sendsmsmessage?' +
      'apiKey=' + apiKey + '&recipient=' + phoneNumber + '&text=' + msgBody;
    
    try {
      var response = UrlFetchApp.fetch(msgUrl);
      Logger.log('response ' + response);
      var res = getContentFromResponse(response);
      if(res.code != 0)
        throw new Error("Произошла ошибка " + res.message);
      
      Logger.log('message was sucessfully sended on ' + phoneNumber);
    }
    catch (err) {
      Logger.log('error while sending a sms. Error: ' + err);
      throw err;
    }
  }
  //private sms
  function parsePhoneNumber(phoneNumber) {
    return phoneNumber.replace('+',''); 
  }
  //private sms
  function getContentFromResponse(response){
    return JSON.parse(response);
  }
  
  
  //private
  function getMessage(messageId) {
    Logger.log('trying to get message from the document');
    //open document by URL
    var doc;
    try {
      doc = DocumentApp.openById(messageId);
    }
    catch (err) {
      Logger.log('word document was not opened: ' + err);
      throw err;
    }
  
    var subject = doc.getName();
    //get content from Google document
    var body = doc.getBody().getText();
    var message = {
      messageSubject: subject,
      messageBody: body
    };
    return message;
  }
  
  //private
  function getRelativePhone(patientInfo) {
    var phoneRelative = 'Телефон родственника';
    return getValueFromJsonObjByKey(patientInfo, emailKey);
  }
  
  //private
  function getPatientStatus(patientInfo) {
    var statusKey = 'Статус ';
    return getValueFromJsonObjByKey(patientInfo, statusKey);
  }
  
  //private
  function getValueFromJsonObjByKey(jsonObj, key) {
    Logger.log('trying to get info by key' + key);
    try {
      return jsonObj[key];
    }
    catch (err) {
      Logger.log("problem to get value by key " + key + ". Error: " + err);
      throw err;
    }
  }