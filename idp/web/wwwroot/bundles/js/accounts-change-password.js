var userAgent = navigator.userAgent;
var regexIe8 = new RegExp("Trident(\/4.0)|(Trident\/5.0)");

$(document).ready(function () {

    var changePassword = new ejs.inputs.TextBox({
        cssClass: 'e-outline',
        floatLabelType: 'Auto',
    });
    changePassword.appendTo('#firstname');
    changePassword.appendTo('#lastname');
    changePassword.appendTo('#companyname');
    changePassword.appendTo('#phone');
    changePassword.appendTo('#new-password');
    changePassword.appendTo('#confirm-password');

    var recoverEmail = new ejs.inputs.TextBox({
        cssClass: 'e-outline',
        floatLabelType: 'Always',
        created: function () {
            outlineEmail.focusIn();
        }
    });
    recoverEmail.appendTo('#key-input');

    $.validator.addMethod("isValidName", function (value, element) {
        return IsValidName("name", value)
    }, window.Server.App.LocalizationContent.AvoidSpecialCharactors);

    $.validator.addMethod("additionalSpecialCharValidation", function (value, element) {
        if (/^[a-zA-Z_0-9`~!\$\^()=\-\.\{\} ]+$/.test(value) || value === "") {
            return true;
        }
    }, window.Server.App.LocalizationContent.AvoidSpecialCharactors);

    $.validator.addMethod("isValidPassword", function (value, element) {
        return IsValidPassword(value);
    }, "");

    $("#update-password-form").validate({
        onkeyup: function (element, event) {
            if (event.target.id.toLowerCase() === "new-password") {
                showPasswordPolicy();
            }
            if (event.keyCode != 9) {
                $(element).valid();

                if ($("#confirm-password").val() != "") {
                    $("#confirm-password").valid();
                }
            }
            else true;
        },
        onfocusout: function (element) { $(element).valid(); },
        onfocusin: function (element, event) {
            if (event.target.id.toLowerCase() === "new-password") {
                showPasswordPolicy();
            }
        },
        rules: {
            "first-name": {
                required: true,
                isValidName: true,
                additionalSpecialCharValidation: true
            },
            "last-name": {
                isValidName: true,
                additionalSpecialCharValidation: true
            },
            "company-name": {
                required: true,
            },
            "password": {
                required: true,
                isValidPassword: true
            },
            "re-password": {
                required: true,
                equalTo: "#new-password"
            }
        },
        messages: {
            "first-name": {
                required: window.Server.App.LocalizationContent.FirstNameValidator
            },
            "company-name": {
                required: window.Server.App.LocalizationContent.CompanyNameValidator
            },
            "password": {
                required: window.Server.App.LocalizationContent.NewPasswordValidator,
                isValidPassword: window.Server.App.LocalizationContent.InvalidPasswordValidator
            },
            "re-password": {
                required: window.Server.App.LocalizationContent.ConfirmNewPassword,
                equalTo: window.Server.App.LocalizationContent.PasswordMismatch
            }
        },
        highlight: function (element) {
            $(element).closest('div').addClass('e-error');
        },
        unhighlight: function (element) {
            $(element).closest('div').removeClass('e-error');
            $(element).parents(".update-form-input-field").find('div.validation-holder').find('span').html("");
        },
        errorElement: 'span',
        errorPlacement: function (error, element) {
            $(element).parents(".update-form-input-field").find('div.validation-holder').find('span').html(error.html());
            $("body").ejWaitingPopup("hide");
        }
    });

    $("#agreement").on("change", function () {
        if ($("#agreement").is(":checked")) {
            $(".proceed-button").removeAttr("disabled");
        } else {
            $(".proceed-button").attr("disabled", "disabled");
        }
    });
});




function IsValidName(validationType, inputString) {
    var regex;
    if (validationType.toLowerCase() === "username") {
        regex = new RegExp(/[*\[\\\]\|\/\:\<\>\%\+\#\&\?\'\"\@\;\,]/);
    }
    else {
        regex = new RegExp(/[*\[\\\]\|\/\:\<\>\%\+\#\?\'\"\;\,]/);
    }
    return !regex.test(inputString);
}

function IsValidPassword(password) {
    if (passwordRegex.test(password)) {
        return true;
    }
    else {
        return false;
    }
}

function showPasswordPolicy() {
    var value = $("#new-password").val().trim();
    var validateMethods = new Array();
    validateMethods.push(validateUserpassword.p_policy_uppercase);
    validateMethods.push(validateUserpassword.p_policy_lowercase);
    validateMethods.push(validateUserpassword.p_policy_number);
    validateMethods.push(validateUserpassword.p_policy_specialcharacter);
    validateMethods.push(validateUserpassword.p_policy_length);

    $.each(validateMethods, function (i) {
        var currentMethodName = validateMethods[i];
        ruleName = currentMethodName(value);
        if (ruleName != undefined && ruleName != "") {
            if (!$("#new-password").next().find("#password_policy_rules").find("li#" + ruleName + " span:first").hasClass("su-password-tick")) {
                $("#new-password").next().find("#password_policy_rules").find("li#" + ruleName + " span:first").addClass("su-password-tick").removeClass("icon");
            }
        }
        else {
            ruleName = name;
            if ($("#new-password").next().find("#password_policy_rules").find("li#" + ruleName + " span:first").hasClass("su-password-tick")) {
                $("#new-password").next().find("#password_policy_rules").find("li#" + ruleName + " span:first").removeClass("su-password-tick").addClass("icon");
            }
        }

        ruleName = "";
    });
}

function changePasswordValidation() {
    $("body").ejWaitingPopup("show");
    return $("#update-password-form").valid();
}


$(document).on("ready", function () {
    $(".show-hide-password").on("click", function () {
        if ($(this).siblings().find("input").is(":password")) {
            $(this).siblings().find("input").attr('type', 'text');
            $(this).removeClass('su-show').addClass('su-hide').attr("data-original-title", window.Server.App.LocalizationContent.ClicktoHide);
            $(this).tooltip('show');
        }
        else {
            $(this).siblings().find("input").attr('type', 'password');
            $(this).removeClass('su-hide').addClass('su-show').attr("data-original-title", window.Server.App.LocalizationContent.ClicktoView);
            $(this).tooltip('show');
        }
    });

    $(".show-hide-password").bind("touch", function () {
        if ($(this).siblings().find("input").is(":password")) {
            $(this).siblings().find("input").attr('type', 'text');
            $(this).removeClass('su-show');
            $(this).addClass('su-hide');

        }
        else {
            $(this).siblings().find("input").attr('type', 'password');
            $(this).removeClass('su-hide');
            $(this).addClass('su-show');

        }
    });
});

var validateUserpassword = {
    p_policy_uppercase: function (userpassword) {
        this.name = "p_policy_uppercase";
        var re = /^(?=.*[A-Z]).+$/;
        if (re.test(userpassword))
            return "p_policy_uppercase"
    },
    p_policy_lowercase: function (userpassword) {
        this.name = "p_policy_lowercase";
        var re = /^(?=.*[a-z]).+$/;
        if (re.test(userpassword))
            return "p_policy_lowercase";
    },
    p_policy_number: function (userpassword) {
        this.name = "p_policy_number";
        var re = /^(?=.*\d).+$/;
        if (re.test(userpassword))
            return "p_policy_number"
    },
    p_policy_specialcharacter: function (userpassword) {
        this.name = "p_policy_specialcharacter";
        var re = /^(?=.*(_|[^\w])).+$/;
        if (re.test(userpassword))
            return "p_policy_specialcharacter"
    },
    p_policy_length: function (userpassword) {
        this.name = "p_policy_length";
        var re = /^(?=.{6,}).+$/
        if (re.test(userpassword))
            return "p_policy_length"
    }
};