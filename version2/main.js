/**
  * Toolbar menu functions
**/

function hideToolbar()
{
 $( "#toolbar" ).toggle( "slide" );
 $( "#btn-opentoolBar" ).delay(350).fadeIn();

 //toggle Classes to set the presentation view
 $('#drawingArea').removeClass('col-lg-8 col-xs-8 col-sm-8 col-md-8');
 $('#drawingArea').addClass('col-lg-9 col-xs-10 col-sm-10 col-md-10');

 console.log(example.className);

}


function showToolbar()
{
 $( "#toolbar" ).toggle( "slide" );
 $( "#btn-opentoolBar" ).delay(350).fadeOut();

 // toggle Classes to set the presentation view
 $('#drawingArea').removeClass('col-lg-9 col-xs-10 col-sm-10 col-md-10');
 $('#drawingArea').addClass('col-lg-8 col-xs-8 col-sm-8 col-md-8');
}
