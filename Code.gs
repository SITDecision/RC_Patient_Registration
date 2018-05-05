function onSubmit(e) {
  newEntry = e;
  if (!(newEntry && newEntry.namedValues)) {
    Logger.log("added form can`be readed");
    throw new Error('Ошибка при получении данных с формы');
  }
  var patientInfo = getValueFromJsonObjByKey(addedCallInfo, 'namedValues');
  
  var recipientEmail = getEmail(patientInfo);
  if (!email) {
    return;
  }
  
  var msgDocId = '1B4BdnpxphDhqyCVWK7sPhJGrkcdUYq8DiPbgoAnHWyQ';
  var msg = getMessage(msgDocId);
  sendMsgToEmail(recipientEmail, msg);
  Logger.log('email was successfullly sended to the ' + recipientEmail);
  
}

//private
function sendMsgToEmail (recipient, message) {
  if (!recipient) {
    Logger.log('recipient was not added');
  }
  if (!message && !message.messageSubject && !message.messageBody) {
    Logger.log('message is empty');
  }
  
  try {
    GmailApp.sendEmail(recipient, message.messageSubject, message.messageBody)
  } 
  catch (err) {
    Logger.log();
    throw err;
  }
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
function getEmail(patientInfo) {
  var emailKey = 'E-mail';
  return getValueFromJsonObjByKey(patientInfo, emailKey);
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