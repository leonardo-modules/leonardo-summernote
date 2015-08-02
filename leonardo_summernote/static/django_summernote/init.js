
/**
This makes sure that we initialise the redactor on the text area once its displayed
so it can be used as part of an inline formset.

Credit to the approach taken in:
https://github.com/yourlabs/django-autocomplete-light
**/
jQuery(document).ready(function() {

  /* patch Horizon init to bind redactor */
  horizon.modals.addModalInitFunction(function (modal) {


    var id_text_textarea = window.document.getElementById('id_text-textarea');
    var id_text_src = window.document.getElementById('id_text');
    var id_text_settings = {"lang": "cs-CZ", "width": 720, "styleWithSpan": true, "url": {"upload_attachment": "/upload_attachment/"}, "airMode": false, "direction": "ltr", "toolbar": [["style", ["style"]], ["font", ["bold", "italic", "underline", "superscript", "subscript", "strikethrough", "clear"]], ["fontname", ["fontname"]], ["fontsize", ["fontsize"]], ["color", ["color"]], ["para", ["ul", "ol", "paragraph"]], ["height", ["height"]], ["table", ["table"]], ["insert", ["link", "picture", "video", "hr"]], ["view", ["fullscreen", "codeview"]], ["help", ["help"]]], "height": 480};
    var csrftoken = getCookie('csrftoken');

    // include summernote language pack, synchronously
    if( id_text_settings.lang != 'en-US' ) {
        $.ajaxSetup({async:false});
        $.getScript('/static/django_summernote/lang/summernote-' + id_text_settings.lang + '.js');
        $.ajaxSetup({async:true});
    }

    $(id_text_textarea).hide();

    $summernote = $(id_text_src);
    $summernote.summernote({
        width: id_text_settings.width,
        height: id_text_settings.height,
        airMode: id_text_settings.airMode == 'true',
        styleWithSpan: id_text_settings.styleWithSpan == 'true',
        prettifyHtml: id_text_settings.prettifyHtml == 'true',
        direction: id_text_settings.direction,
        toolbar: id_text_settings.toolbar,
        lang: id_text_settings.lang,
        onInit: function() {
            var nEditor = $('.note-editor');
            var nToolbar = $('.note-toolbar');
            var nEditable = $('.note-editable');
            var nStatusbar = $('.note-statusbar');
            var setHeight = parseInt(id_text_settings.height)  // default
                    - nToolbar.outerHeight()  // toolbar height including margin,border,padding
                    - (nEditable.innerHeight() - nEditable.height())  // editable's padding
                    - (nEditor.outerHeight() - nEditor.innerHeight())  // editor's border
                    - nStatusbar.outerHeight();  // status bar height

            nEditable.height(setHeight);
        },
        onBlur: function() {
            id_text_textarea.value = $(this).code();
        },
        onImageUpload: function(files) {
            var imageInput = $('.note-image-input');
            var sn = $(this);
            imageInput.fileupload();
            var jqXHR = imageInput.fileupload('send', 
                {
                    files: files,
                    formData: {csrfmiddlewaretoken: csrftoken},
                    url: id_text_settings.url.upload_attachment,
                })
                .success(function (result, textStatus, jqXHR) {
                    data = $.parseJSON(result);
                    $.each(data.files, function (index, file) {
                        sn.summernote("insertImage", file.url);
                    });
                })
                .error(function (jqXHR, textStatus, errorThrown) {
                    // TODO: Display a detailed error message. It will come from JSON.
                    alert( 'Got an error while uploading images.' );
                });
        }
    });

    // See https://docs.djangoproject.com/en/dev/ref/contrib/csrf/#ajax
    function getCookie(name) {
        var cookieValue = null;
        if (document.cookie && document.cookie != '') {
            var cookies = document.cookie.split(';');
            for (var i = 0; i < cookies.length; i++) {
                var cookie = jQuery.trim(cookies[i]);
                // Does this cookie string begin with the name we want?
                if (cookie.substring(0, name.length + 1) == (name + '=')) {
                    cookieValue = decodeURIComponent(cookie.substring(name.length + 1));
                    break;
                }
            }
        }
        return cookieValue;
    }


  });
});