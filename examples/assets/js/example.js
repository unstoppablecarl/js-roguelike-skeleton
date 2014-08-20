var $exCode = $('.ex-code-container');

$exCode.each(function(){
    var $this = $(this),
        $pre = $this.find('.ex-code'),
        $code = $pre.children('code:first-child'),
        $input = $this.find('.ex-code-input'),
        $btnRun = $this.find('.ex-btn-run'),
        $btnEdit = $this.find('.ex-btn-edit'),
        $btnView = $this.find('.ex-btn-view'),
        code = $code.text();

        $input.val(code);
        $input.hide();
        $btnView.hide();

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

var $btnToggleSetup = $('.btn-toggle-setup');
    $setupCode = $('.setup-code');

$setupCode.hide();
var setupCodeVisible = false;

$btnToggleSetup.click(function(e){
    e.preventDefault();
    if(setupCodeVisible){
        $btnToggleSetup.text('Show');
        $setupCode.hide();
        setupCodeVisible = false;
    } else {
        $btnToggleSetup.text('Hide');
        $setupCode.show();
        setupCodeVisible = true;
    }

});