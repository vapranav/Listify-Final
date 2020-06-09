function openForm() {
    document.getElementById("loginPopup").style.display="block";
  }
  
  
  function closeForm() {
    document.getElementById("loginPopup").style.display= "none";
  }
  function closeForm2() {
    document.getElementById("loginPopup2").style.display= "none";
  }
  // When the user clicks anywhere outside of the modal, close it
  window.onclick = function(event) {
    var modal = document.getElementById('loginPopup');
    if (event.target == modal) {
      closeForm();
    }
  }
  
var count = 1;
var count2 = 1;

  function addInput() {
    count = count+1;
    var listitem = document.createElement("input");
    listitem.setAttribute("type", "text");
    listitem.setAttribute("placeholder", "List Item");
    listitem.setAttribute("name", "item"+count)
    document.getElementById("inputs").appendChild(listitem);
  }

  function addInput2() {
    count2 = count2+1;
    var listitem = document.createElement("input");
    listitem.setAttribute("type", "text");
    listitem.setAttribute("placeholder", "List Item");
    listitem.setAttribute("name", "item"+count2)
    document.getElementById("inputs2").appendChild(listitem);
  }

function addFlip() {
    document.querySelectorAll('.card').forEach(item => {
        item.addEventListener('click', event => {
            item.classList.toggle('is-flipped');

        })
      })
}

$(".btn-danger").click(function(event){
  event.stopPropagation();
  var name = $(this).attr('data-mongo-id');
  $(this).parent().remove();
  
  $.ajax({
    method:'DELETE',
    url:'/' + name,
  
      success : function( data) {
        console.log('success');
     },
    error : function() {
      console.log('error');
  
    }
  })
});


$(".try").click(function(event){
  event.stopPropagation();
  document.getElementById("loginPopup2").style.display="block";
  var categoryId = $(this).attr('data-mongo-id');
  console.log(categoryId);
  $("#listForm").attr('action',"http://localhost:3000/"+categoryId+"/add")
})
