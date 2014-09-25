$('[data-toggle="collapse"]').each(function(){
    var $btn = $(this),
        target = $btn.data('target'),
        $target = $(target),
        isCollapsed = !$target.hasClass('in');

    var show = function(){
        $btn.text('Show');
    };

    var hide = function(){
        $btn.text('Hide');
    };

    $target.on('hide.bs.collapse', show);
    $target.on('show.bs.collapse', hide);

    if(isCollapsed){
        show();
    } else {
        hide();
    }
});

