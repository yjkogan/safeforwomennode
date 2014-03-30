$(function() {
  $("#add-mentor-btn").click(function(e) {
    e.preventDefault();
    var phone = $(this).siblings('.phone').val();
    var mentee_id = $(this).siblings('.mentee_id').val();
    $.ajax({
      type: 'POST',
      url: '/mentees',
      data: {
        phone: phone,
        mentee_id: mentee_id
      }
    }).done(function(data) {
      console.log(data);
      location.reload();
    });
  })
})
