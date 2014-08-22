var bindToggleBtn = function($btn, $target, currentState, showLabel, hideLabel){
    currentState = currentState !== void 0 ? currentState : false;
    showLabel = showLabel || 'Show';
    hideLabel = hideLabel || 'Hide';

    var show = function(){
        $btn.data('toggle_state', true);
        $btn.text(hideLabel);
        $target.show();
        currentState = true;
    };

    var hide = function(){
        $btn.data('toggle_state', false);
        $btn.text(showLabel);
        $target.hide();
        currentState = false;
    };

    if(!currentState){
        hide();
    } else {
        show();
    }
    $btn.click(function(e){
        e.preventDefault();
        if(currentState){
            hide();
        } else {
            show();
        }
    });
};

$('[data-btn_toggle').each(function(){
    var $this = $(this),
        data = $this.data(),
        target = data.btn_toggle,
        $target = $(target),
        currentState = (data.toggle_state_visible in data),
        showLabel = data.toggle_show_label,
        hideLabel = data.toggle_hide_label;
        bindToggleBtn($this, $target, currentState, showLabel, hideLabel);
});

var $btnToggleSetup = $('.btn-toggle-setup');
    $setupCode = $('.setup-code');

if($btnToggleSetup.length && $setupCode.length){
    bindToggleBtn($btnToggleSetup, $setupCode);
}
// $setupCode.hide();
// var setupCodeVisible = false;

// $btnToggleSetup.click(function(e){
//     e.preventDefault();
//     if(setupCodeVisible){
//         $btnToggleSetup.text('Show');
//         $setupCode.hide();
//         setupCodeVisible = false;
//     } else {
//         $btnToggleSetup.text('Hide');
//         $setupCode.show();
//         setupCodeVisible = true;
//     }

// });


var $exCode = $('.ex-code-container');

$exCode.each(function(){
    var $this = $(this),
        $codeContainer = $this.find('.ex-code'),
        $pre = $codeContainer.find('pre:first-child'),
        $code = $pre.children('code:first-child'),
        $input = $this.find('.ex-code-input'),
        $btnRun = $this.find('.ex-btn-run'),
        $btnEdit = $this.find('.ex-btn-edit'),
        $btnToggle = $this.find('.ex-btn-toggle'),
        $btnView = $this.find('.ex-btn-view'),
        code = $code.text();

        $input.val(code);
        $input.hide();
        $btnView.hide();

        bindToggleBtn($btnToggle, $codeContainer);

        var inputToCode = function(){
            $input.hide();
            $code.text($input.val());
            $pre.show();
            $btnEdit.show();
            $btnView.hide();
            Prism.highlightElement($code[0]);
        };

        var codeToInput = function(){
            $input.show();
            $pre.hide();
            $btnEdit.hide();
            $btnView.show();
        };

        var run = function(){
            eval($input.val());
        };

        $pre.click(function(){
           codeToInput();
        });

        $input.blur(function(){
            inputToCode();
        });

        $btnEdit.click(function(e){
            e.preventDefault();
            codeToInput();
            if(!$btnToggle.data('toggle_state')){

            }
        });

        $btnView.click(function(e){
            e.preventDefault();
            inputToCode();
        });

        $btnRun.click(function(e){
            e.preventDefault();
            run();
        });

        run();
});