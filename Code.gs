function onSubmit(e) {
  newEntry = e;
  if (!(newEntry && newEntry.namedValues)) {
    Logger.log("added form can`be readed");
    throw new Error('Ошибка при получении данных с формы');
  }
  var patientInfo = getValueFromJsonObjByKey(addedCallInfo, 'namedValues');
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