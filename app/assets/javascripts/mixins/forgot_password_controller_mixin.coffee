App.ForgotPasswordControllerMixin = Em.Mixin.create
  actions:
    resetPassword: ->
      @set('isRequesting', true)
      promise = @get('model').request()
      promise.then =>
        @send('reset')
        @set('isRequesting', false)
        @transitionToRoute('forgot_password.success')
      promise.catch (error)=>
        message = if error = 'Unprocessable Entity'
          'No new password given'
        else
          'Unknown token supplied'
        App.Alert.add
          message:  message
          severity: 'error'
        @set('isRequesting', false)

    reset: ->
      @setProperties
        token:       null
        newPassword: null
