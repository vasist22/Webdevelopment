$(document).ready(function($) {


    // Form submission listener
    $('form#weathshow #show').on('click',  function(e){
	
        var data = $("#weathshow").serialize();

       $.ajax({
                url : "/backend/haus.php",                 // Use our localized variable that holds the AJAX URL
                type: 'POST',  
				dataType: 'json',    // Declare our ajax submission method ( GET or POST )
                data: data,
          success: function(data){
                if(data.type == "success"){
                    $('#dtor').html(message);
                    alert('showed up succcessfully!');
                    console.log('btn not workings');
					/*$('form#um_form p.stato').text(data.message);*/
				$("#um_form")[0].reset();
				
				}else{
                    console.log('btn not workings');
					$("#um_form")[0].reset();
				}
          }
            });
              e.preventDefault();

       }); 

      
} );