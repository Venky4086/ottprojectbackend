$(function(){
    empty = (e) => {
        if(e.constructor === Object && Object.keys(e).length == 0){
        return true;
        }

        if(e.constructor === Array && e.length == 0){
        return true;
        }

        switch (e) {
        case "":
        case 0:
        case "0":
        case null:
        case false:
        case typeof(e) == "undefined":
            return true;
        default:
            return false;
        }
    }
        
    $(document).on('keypress', '.number', function (evt) {
        var charCode = (evt.which) ? evt.which : event.keyCode;
        if (charCode > 47 && charCode < 58)
        return true;
        return false;
    });
    
    $(document).on('blur', '.number', function (event) {
        var str = $(this).val();
        var string = '';
        for (let i = 0; i < str.length; i++) {
        charCode = str.charCodeAt(i);
        if (charCode > 47 && charCode < 58){
            string += str[i];
        }
        }
        $(this).val(string);
    });

    function isNumber(evt, element) {
        var charCode = (evt.which) ? evt.which : event.keyCode
        if (
          (charCode != 46 || $(element).val().indexOf('.') != -1) && // Check for dots and only once.
          (charCode < 48 || charCode > 57))
          return false;
        return true;
      }
      
    $(document).on('change keyup keydown', '.amount_field', function (event) {
        var decval = 0;
        var cost = $(this).val().split('.');
        if (cost.length > 1) {
        decval = cost[cost.length - 1];
        if (decval.length > 2) {
            cost.pop();
            var twoDecimalPlace = decval.substr(0, 2);
            cost.push(twoDecimalPlace);
            cost = cost.join('.');
            $(this).val(cost);
        }
        }
    });
    $(document).on('keypress', '.amount_field , .percentage', function (event) {
        return isNumber(event, this);
    });
    
    $(document).on('blur', '.amount_field', function (event) {
        var value = Number($(this).val());
        $(this).val(value.toFixed(2));
    });
});