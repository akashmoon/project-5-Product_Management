
const isValidFiles = function(files) {
  if(files && files.length > 0)
  return true
}

const isValidRequestBody = function (reqbody) {
  if (!Object.keys(reqbody).length) {
      return false;
  }
  return true;
};

const isValid = function (value) {
    if (typeof value === 'undefined' || value === null) return false
    if (typeof value === 'string' && value.trim().length === 0) return false
    return true;
}
const isValidImg = (img) => {
  const reg = /image\/png|image\/jpeg|image\/jpg/;
  return reg.test(img)
}

let nameRegex = /^[.a-zA-Z\s]+$/
let emailRegex = /^[a-z]{1}[a-z0-9._]{1,100}[@]{1}[a-z]{2,15}[.]{1}[a-z]{2,10}$/
let phoneRegex = /^(\+91[\-\s]?)?[0]?(91)?[6789]\d{9}$/
let passRegex = /^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9])(?=.*?[#?!@$%^&*-]).{8,15}$/
let numRegex = /^[0-9]*$/
let priceReg = /^[+-]?([0-9]+\.?[0-9]*|\.[0-9]+)$/
let numsRegex = /^(0|1)$/
let cancelRegex = /^(true|false)$/
let statusRegex =  /^(pending|completed|cancelled)$/

module.exports= { isValidFiles, isValid,isValidRequestBody,isValidImg, 
                  nameRegex,emailRegex, phoneRegex, passRegex, numRegex, 
                  priceReg,numsRegex, cancelRegex, statusRegex 
                }