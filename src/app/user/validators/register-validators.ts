import { ValidationErrors , AbstractControl,ValidatorFn} from "@angular/forms";  //return type of validator

export class RegisterValidators {
  static match( controlName:string,matchingControlName:string):ValidatorFn{   //factory function for matching control
    return (group: AbstractControl): ValidationErrors|null=>{
    const control=group.get(controlName)
    const matchingControl=group.get(matchingControlName)
    if(!matchingControl || !control){
      console.error('Form Controls can not be found in the form group.')
      return { controlNotFound: true}
    }
const error=control.value===matchingControl.value ? null : {noMatch:true}
matchingControl.setErrors(error)                                           //adding the error to the confirm_password control

return error
  }}

}
