(function () {

    var passwordsMatch = function (password, passwordConfirm) {
        return password === passwordConfirm;
    };

    var passwordIsComplex = function (password) {
        // TODO: implement password complexity rules here.  There should be similar rule on the server side.
        return true;
    };

    var emailAddressIsValid = function (email) {
        var re = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        return re.test(email);
    };


    $(document).delegate("#page-signup", "pagebeforecreate", function () {

        var $signUpPage = $("#page-signup"),
            $btnSubmit = $("#btn-submit", $signUpPage);

        $btnSubmit.off("tap").on("tap", function () {

            var $ctnErr = $("#ctn-err", $signUpPage),
                $txtFirstName = $("#txt-first-name", $signUpPage),
                $txtLastName = $("#txt-last-name", $signUpPage),
                $txtEmailAddress = $("#txt-email-address", $signUpPage),
                $txtPassword = $("#txt-password", $signUpPage),
                $txtPasswordConfirm = $("#txt-password-confirm", $signUpPage);

            var firstName = $txtFirstName.val().trim(),
                lastName = $txtLastName.val().trim(),
                emailAddress = $txtEmailAddress.val().trim(),
                password = $txtPassword.val().trim(),
                passwordConfirm = $txtPasswordConfirm.val().trim(),
                invalidInput = false,
                invisibleStyle = "bi-invisible",
                invalidInputStyle = "bi-invalid-input";

            // Reset styles.
            $ctnErr.removeClass().addClass(invisibleStyle);
            $txtFirstName.removeClass(invalidInputStyle);
            $txtLastName.removeClass(invalidInputStyle);
            $txtEmailAddress.removeClass(invalidInputStyle);
            $txtPassword.removeClass(invalidInputStyle);
            $txtPasswordConfirm.removeClass(invalidInputStyle);

            // Flag each invalid field.
            if (firstName.length === 0) {
                $txtFirstName.addClass(invalidInputStyle);
                invalidInput = true;
            }
            if (lastName.length === 0) {
                $txtLastName.addClass(invalidInputStyle);
                invalidInput = true;
            }
            if (emailAddress.length === 0) {
                $txtEmailAddress.addClass(invalidInputStyle);
                invalidInput = true;
            }
            if (password.length === 0) {
                $txtPassword.addClass(invalidInputStyle);
                invalidInput = true;
            }
            if (passwordConfirm.length === 0) {
                $txtPasswordConfirm.addClass(invalidInputStyle);
                invalidInput = true;
            }

            // Make sure that all the required fields have values.
            if (invalidInput) {
                $ctnErr.html("<p>Please enter all the required fields.</p>");
                $ctnErr.addClass("bi-ctn-err").slideDown();
                return;
            }

            if (!emailAddressIsValid(emailAddress)) {
                $ctnErr.html("<p>Please enter a valid email address.</p>");
                $ctnErr.addClass("bi-ctn-err").slideDown();
                $txtEmailAddress.addClass(invalidInputStyle);
                return;
            }

            if (!passwordsMatch(password, passwordConfirm)) {
                $ctnErr.html("<p>Your passwords don't match.</p>");
                $ctnErr.addClass("bi-ctn-err").slideDown();
                $txtPassword.addClass(invalidInputStyle);
                $txtPasswordConfirm.addClass(invalidInputStyle);
                return;
            }

            if (!passwordIsComplex(password)) {
                // TODO: Use error message to explain password rules.
                $ctnErr.html("<p>Your password is very easy to guess.  Please try a more complex password.</p>");
                $ctnErr.addClass("bi-ctn-err").slideDown();
                $txtPassword.addClass(invalidInputStyle);
                $txtPasswordConfirm.addClass(invalidInputStyle);
                return;
            }

            $.ajax({
                type: 'POST',
                url: BookIt.Settings.signUpUrl,
                data: "email=" + emailAddress + "&firstName=" + firstName + "&lastName=" + lastName + "&password=" + password + "&passwordConfirm=" + passwordConfirm,
                success: function (resp) {
                    console.log("success");
                    if (resp.success === true) {
                        $.mobile.navigate("signup-succeeded.html");
                        return;
                    }
                    if (resp.extras.msg) {
                        switch (resp.extras.msg) {
                            case BookIt.ApiMessages.DB_ERROR:
                            case BookIt.ApiMessages.COULD_NOT_CREATE_USER:
                                // TODO: Use a friendlier error message below.
                                $ctnErr.html("<p>Oops! BookIt had a problem and could not register you.  Please try again in a few minutes.</p>");
                                $ctnErr.addClass("bi-ctn-err").slideDown();
                                break;
                            case BookIt.ApiMessages.EMAIL_ALREADY_EXISTS:
                                $ctnErr.html("<p>The email address that you provided is already registered.</p>");
                                $ctnErr.addClass("bi-ctn-err").slideDown();
                                $txtEmailAddress.addClass(invalidInputStyle);
                                break;
                        }
                    }

                },
                error: function (e) {
                    console.log(e.message);
                    // TODO: Use a friendlier error message below.
                    $ctnErr.html("<p>Oops! BookIt had a problem and could not register you.  Please try again in a few minutes.</p>");
                    $ctnErr.addClass("bi-ctn-err").slideDown();
                }
            });
        });
    });
})();