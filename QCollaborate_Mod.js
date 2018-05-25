/**
 * QCollaborate Mod v1.0.0
 *
 * Features :
 *  1.  Auto add favorite views to side menu
 */

var favorite_views = [];
var my_view = '';
var autoload = false;

var main_ctrl, main_scope, my_scope;

$( document ).ready(function() {
    if (typeof user_favorite_views !== 'undefined' && user_favorite_views.length > 0) {
        favorite_views = user_favorite_views;
    }
    if (typeof user_view !== 'undefined') {
        my_view = user_view;
    }
    if (typeof user_autoload !== 'undefined') {
        autoload = user_autoload;
    }
});

$( document ).on( "customReady", function(){
    console.log('QCM >>', '----------Welcome to QCollaborate Mod----------');

    main_ctrl = $('body>div[ng-app="qcollaborate"]>div.ng-scope>div[ng-controller="MainCtrl as $ctrl"]');
    main_scope = main_ctrl.scope();
    console.log('QCM >>', 'main scope = ', main_scope);

    // add all user views to side-menu
    if(favorite_views.length > 0){
        var views = $('#view-content>div>div>div.row>div div[title]');
        $.each(views, function( index, value ) {
            // console.log('QCM >>', 'View[', index, '] =', value.title, 'user_favorite_views =',$.inArray(value.title, user_favorite_views) );

            if($.inArray(value.title, user_favorite_views) >= 0){
                var scope = $(value).scope();
                if(value.title == my_view)
                    my_scope = scope;
                //console.log('QCM >>', value.title, ';scope =',  scope);
                //console.log('QCM >>', 'scope =',  scope);
                //console.log('QCM >>', 'scope.x =',  scope.x);

                scope.togglesubscribe(scope.x, 'view');
                console.log('QCM >>', 'view [', value.title, '] --> added to side-menu' );
            }
        });
    }

    // autoload user view
    if(autoload && my_view != "" && my_scope != 'undefined'){
        //console.log(value);
        console.log('QCM >>', 'changing view to -->', my_scope.x.field_view, my_scope);
        main_scope.changeview(my_scope.x.field_view);
        //console.log(my_scope.x.field_image)
        //$('#sidebarplaceholder>#contentheader>div>img').attr('src', my_scope.x.field_image)
    }
});

var count_views = 0;
var total_changes = 0;
var count_changes = 0;
var loaded = false;

$(document).on("DOMNodeInserted", '#view-content>div>div>div.row>div>div[title]', function(e){
    //loading each view content
    count_views++;
    var element = e.target;
    total_changes = total_changes + element.attributes.length + 1; //+1 for initial set of attribute values
    //console.log('QCM >>',element);
});

// triggers 'customReady' event when list of views is loaded
$(document).on('DOMAttrModified', '#view-content>div>div>div.row>div>div[title]', function(e){  //DOMSubtreeModified, DOMAttrModified
    ++count_changes;
    var element = e.target;
    var attrname = e.originalEvent.attrName;
    //console.log('QCM >>' , 'change ',count_changes, ':', attrname, element);

    if(count_changes == total_changes){
        loaded = true;
        $( document ).trigger( "customReady" );
    }
});