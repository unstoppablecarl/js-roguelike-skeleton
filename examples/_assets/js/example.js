var $exContainer = $('.example-container');

$exContainer.each(function(){
    var $this = $(this);

    var $exCodeContainer = $this.find('.ex-code'),
        $exCode = $this.find('.ex-code code'),
        $exInput = $this.find('.ex-code-input'),
        $btnRun = $this.find('.ex-btn-run'),
        code = $exCode.text();

    $exInput.val(code);
    $exInput.hide();

    var inputToCode = function(){
        $exInput.hide();
        $exCode.text($exInput.val());
        $exCodeContainer.show();
        Prism.highlightElement($exCode[0]);
    };

    var codeToInput = function(){
        $exInput.show();
        $exCodeContainer.hide();
    };

    var run = function(){
        eval($exInput.val());
    };

    $exCodeContainer.click(function(){
       codeToInput();
    });

    $exInput.blur(function(){
        inputToCode();
    });

    $btnRun.click(function(e){
        e.preventDefault();
        inputToCode();
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