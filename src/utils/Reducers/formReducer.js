export const reducer = (state, action) => {
  const { validationResult, inputId, inputValues } = action

  const updatedValues = {
    ...state.inputValues,
    [inputId]: inputValues
  }

  const updatedValidities = {
    ...state.inputValidities,
    [inputId]: validationResult
  }

  let updatedFormIsValid = true;

  for(const key in updatedValidities){
    if (updatedValidities[key] !== undefined) {
      updatedFormIsValid = false
      break
    }
  }

  return {
    inputValues: updatedValues,
    inputValidities: updatedValidities,
    formIsValid: updatedFormIsValid
  }
}