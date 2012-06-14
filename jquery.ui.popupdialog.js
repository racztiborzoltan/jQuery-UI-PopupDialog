/**!
 * 
 * jQuery UI Popup Dialogs (alert, confirm, prompt)
 * 
 * Based on: http://jvance.com/pages/jQueryOpenIdPlugin.xhtml
 * 
 * Szükséges:
 * 	jQuery 1.7+
 * 	jQuery UI 1.8+ (jQuery UI Dialog)
 * 
 * Usage: (The 'options' parameter details below!)
 * 
 * jQuery.popupDialog('alert', content_string);
 * jQuery.popupDialog('alert', content_string, ok_function);
 * jQuery.popupDialog('alert', options);
 * jQuery.popupDialog('confirm', content_string, ok_function);
 * jQuery.popupDialog('confirm', options);
 * jQuery.popupDialog('alert', options);
 * 
 * 
 * options parameter (with default values):
 * {
 * 	// Dialog widget object (not configurable, but can be used in 'ok' and 'cancel' 
 * 	// function in this form: this.ui)
 * 	ui: null,
 * 	// dialog title. If not specified or empty string, then dialog title is hidden!
 * 	title: '',
 * 	// Text of dialog. Default value is empty string
 * 	content: '',
 * 	// This function executed when you click on "OK" button
 * 	ok: function(){},
 *	// "OK" button text
 * 	okText: 'Ok',
 * 	// This function executed when you click on "Cancel" button
 * 	cancel: function(){},
 *	// "Cancel" button text
 * 	cancelText: 'Cancel',
 * 	// jQuery UI Dialog "closedialog" event
 * 	// This function not equivalent with 'cancel' function!!!
 * 	// 'cancel' run, when you clicked on the 'cancelText' button in the dialog!
 * 	// 'close' run, when in the dialog press ESC, or click on button and close
 * 	// automatic dialog window!
 * 	close: function(){},
 * 	// default value of input field in 'prompt' dialog
 * 	value: '',
 * }
 * 
 * options values and dialog type assignments???
 * 	alert --> title, content, ok, okText
 * 	confirm --> title, content, ok, okText, cancel, cancelText
 * 	prompt --> title, content, ok, okText, cancel, cancelText, value
 * 
 * 
 * Sorry my bad English!!!
 * 
 * To be continued... I hope!
 * 
 * @version v0.1
 * @author Rácz Tibor Zoltán <racztiborzoltan@gmail.com>
 * @license http://www.opensource.org/licenses/bsd-license.php
 */
;(function($) {
$.popupDialog = function(dialog_type) 
{
	var options = new Object();
	// If the 2. parameter is object, then 2. parameter contains the configs:
	if (typeof arguments[1] == 'object') options = arguments[1]; 
	// If the 2. parameter is string, then 2. parameter is content of dialog:
	if (typeof arguments[1] == 'string') options['content'] = arguments[1];
	// If the 3. parameter is function, then 3. parameter is "OK function":
	if (typeof arguments[2] == 'function') options['ok'] = arguments[2];
	// If the 3. parameter is not a function and dialog type is prompt, then the
	// 3. parameter is default value of input in prompt dialog:
	if (typeof arguments[2] != 'function' && typeof arguments[2] != 'undefined' && dialog_type=='prompt') options['value'] = arguments[2];
	// If the 4. parameter is a function and dialog type is prompt, then the
	// 4. parameter is "OK" function:
	if (typeof arguments[3] == 'function' && dialog_type=='prompt') options['ok'] = arguments[3];
	
	// Merge configs:
	var options = $.extend({}, {
			ui: null,
			title: '',
			content: '',
			ok: function(){},
			okText: 'Ok',
			cancel: function(){}, // only for confirm and prompt
			cancelText: 'Cancel', // only for confirm and prompt
			close: function(){},
			value: '', // only for prompt dialog
		}, options);
	
	// Dialog <div>
	$dialog = $('<div />');
	// Set dialog content, if not empty string:
	if (options.content!='') $dialog.html(options.content);
	
	// Default jQuery UI Dialog configs:
	var dialog_config = {
			title: options.title,
			autoOpen: false,
			modal: true,
			minHeight: 0,
			minWidth: 0,
			buttons: {},
			close: options.close,
		};

	// At the ennd of this function to return value:
	var ret = null;
	
	// "OK" button function add the default dialog settings:
	dialog_config.buttons[options.okText] = function() {
		$(this).dialog('close');
		options.ok();
		$(this).dialog('destroy').remove();
		return true;
	};
	
	// If dialog type is prompt or confirm, then add the "Cancel" function to 
	// default dialog settings:
	if (dialog_type == 'prompt' || dialog_type == 'confirm') 
	{
		dialog_config.buttons[options.cancelText] = function() {
			$(this).dialog('close');
			options.cancel();
			$(this).dialog('destroy').remove();
			return false;
		};
	}
	
	// If dialog type is prompt add more content with input field, and a bit
	// input field event:
	if (dialog_type == 'prompt')
	{
		$dialog.html( $dialog.html() + '<input class="prompt" type="text" value="'+options.value+'" style="width:98%"/>'); 
		$dialog.find('input[type="text"]').keypress(function(e){
			if (e.which == 13) 
			{
				$(this).parents('.ui-dialog').find('.ui-dialog-buttonset button:eq(0)').click();
			}
		});
	}
	
	// Open dialog really:
	$dialog.appendTo($('body')).dialog(dialog_config);
	options['ui'] = $dialog.dialog('widget');
	$dialog.dialog('open');
	// If empty the title value, then hide title of jQuery UI Dialog
	if (options.title == undefined || options.title=='')
		$dialog.dialog('widget').find('.ui-dialog-titlebar').hide();

	return ret;
}; // END jQuery.popupDialog()
})(jQuery);