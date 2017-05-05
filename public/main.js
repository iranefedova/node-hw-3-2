$( document ).ready(function() {
  get_all();
});

  function get_all(){
    $('#contact-list').empty();
    $.ajax({
      type: 'GET',
      url: 'http://127.0.0.1:3000/all',
      success: function(data) {
        add_items('div#contact-list', data);
      },
      error:  function(err, str){
        alert('Возникла ошибка: ' + err);
      }
    });
  }

  function add_items(place, data) {
    for (let i = 0; i < data.length; i++) {
      $(place).append('<div class="flex list-item" id="' + data[i].number + '">' + data[i].name + ' ' + data[i].lastname + ' - ' + data[i].phone +
      '<div><input type="button" name="more" value="Подробно" onclick="show_more(' + data[i].number + ')"><input type="button" name="edit" value="Редактировать" onclick="show_edit(' + data[i].number + ')"><input type="button" name="edit" onclick="delete_contact(' + data[i].number + ');" value="Удалить"></div></div>');
    }
  }

  function add_contact() {
    if (!$('input[name="name"]').val() || !$('input[name="lastname"]').val() || !$('input[name="phone"]').val()) {
      $('#results').html('Имя, фамилия и телефон обязательны для заполнения!').fadeIn().delay(1500).fadeOut();
      return;
    }
    if (!$.isNumeric($('input[name="phone"]').val())) {
      $('#results').html('Номер телефона может содержать только цифры!').fadeIn().delay(1500).fadeOut();
      return;
    }
 	  let msg   = $('#main-form').serialize();
    let m = '';
    $('.additional-form').each(function(i,elem) {
      if (!$('input[name="new_field"]').val() || !$('input[name="new_value"]').val()) {
        $('#results').html('Если добавили дополнительные поля, будьте добры их заполнить').fadeIn().delay(1500).fadeOut();
        return;
      }
    	m = m + '&' + $(this).serialize();
    });
    if (m != '') {
      msg = msg + '&' + m;
    }
        $.ajax({
          type: 'POST',
          url: 'http://127.0.0.1:3000/users',
          data: msg,
          success: function(data) {
            $('#results').html('Контакт добавлен').fadeIn().delay(900).fadeOut();
            add_items('div#contact-list', data);
          },
          error:  function(err, str){
	           alert('Возникла ошибка: ' + err);
          }
        });

    }

    function delete_contact(number) {
      $.ajax({
        type: 'DELETE',
        url: 'http://127.0.0.1:3000/users/' + number,
        success: function(data) {
          $('#results').html(data).fadeIn().delay(900).fadeOut();
          get_all();
          $('div#' + number).remove();
        },
        error:  function(err, str){
           alert('Возникла ошибка: ' + err);
        }
      });
    }

    function show_edit(number) {
      $('.popup-bgr').removeClass('hidden');
      $('.popup-body').append('<h3>Редактирование контакта</h3>');
      $('.popup-body').append('<form action="javascript:void(null);" method="post" id="edit_form"></form>');
      $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:3000/users/' + number,
        success: function(data) {
          for (let key in data[0]) {
            $('#edit_form').append(
              '<div class="flex"><label for="new-name">' + (key == 'name' ? 'Имя' : (key == 'phone') ? 'Телефон' : (key == 'lastname') ? 'Фамилия' : key) + '</label><input type="text" name="' + key + '" value="' + data[0][key] + '"></div>'
            );
          }
        },
        error:  function(err, str){
           alert('Возникла ошибка: ' + err);
        }
      });
      $('.popup-body').append('<div style="text-align: right;" class="bottom-btn"><input type="button" name="" value="Изменить" onclick="edit_contact(' + number + ')"><input type="button" name="" value="Отмена" onclick="hide();"></div>');
    }

    function hide() {
      $('.popup-bgr').addClass('hidden');
      $('.popup-body').empty();
    }

    function show_additional() {
      $('.additional').removeClass('hidden');
      $('#add_additional').addClass('hidden');
      if (!$("form").is(".additional-form")) {
        add_form();
      }
    }

    let additional_form = '<form class="additional-form" method="post" action="javascript:void(null);"><div class="flex"><label for="new_field">Введите название графы <i>(например, Skype)</i></label><input type="text" name="new_field"></div><div class="flex"><label for="new_value">Введите значение</label><input type="text" name="new_value"></div></form>';

    function add_form() {
      $('.additional').append(additional_form);
    }

    function delete_form() {
      $('.additional').addClass('hidden');
      $('.additional-form').remove();
      $('#add_additional').removeClass('hidden');
    }

    function edit_contact(number) {
      let msg = $('#edit_form').serialize();
      msg = msg + '&' + 'number=' + number;
      console.log(msg);
      $.ajax({
        type: 'PUT',
        url: 'http://127.0.0.1:3000/users/' + number,
        data: msg,
        success: function(data) {
          $('#results').html(data).fadeIn().delay(900).fadeOut();
          hide();
          get_all();
          $('#search_results').empty();
        },
        error:  function(err, str){
           alert('Возникла ошибка: ' + err);
        }
      });
    }

    function show_more(number) {
      $.ajax({
        type: 'GET',
        url: 'http://127.0.0.1:3000/users/' + number,
        success: function(data) {
          $('.popup-bgr').removeClass('hidden');
          $('.popup-body').append('<h3>Просмотр контакта</h3>');
          $('.popup-body').append('<form action="javascript:void(null);" method="post" id="more_form"></form>');
          for (let key in data[0]) {
            $('#more_form').append(
              '<div class="flex list-item"><label for="new-name">' + (key == 'name' ? 'Имя' : (key == 'phone') ? 'Телефон' : (key == 'lastname') ? 'Фамилия' : key) + '</label><span>' + data[0][key] + '</span></div>'
            );
          }
            $('.popup-body').append('<div style="text-align: right;" class="bottom-btn"><input type="button" name="" value="Отмена" onclick="hide();"></div>');
        },
        error:  function(err, str){
           alert('Возникла ошибка: ' + err);
        }
      });
    }

    function mySearch() {
      if (!$('input[name="for_search"]').val()) {
        $('#results').html('Пустой поисковый запрос!').fadeIn().delay(900).fadeOut();
        return;
      }
      let msg = $('#search_form').serialize();
      $.ajax({
        type: 'POST',
        url: 'http://127.0.0.1:3000/users/find',
        data: msg,
        success: function(data) {
          console.log(data);
          if ($.isEmptyObject(data)) {
            $('#search_results').html('К сожалению, ничего нет');
          } else {
            $('#search_results').empty();
            add_items('#search_results', data);
          }
        },
        error:  function(err, str){
           alert('Возникла ошибка: ' + err);
        }
      });
    }
