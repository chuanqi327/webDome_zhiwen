
	
	$(function () {
		//查询
		$('#search_button').button({
			icons : {
				primary : 'ui-icon-search',
			},
		});
		//提问
		$('#question_button').button({
			icons : {
				primary : 'ui-icon-lightbulb',
			},
		}).click(function(){
			if($.cookie("user")){
				$('#question').dialog('open');	
			}else{
				$('#error').dialog('open');
				setTimeout(function(){
					$('#error').dialog('close');
					$('#login').dialog('open');
				},1000);
			}
		});
		
		//显示content
		$.ajax({
			url : 'show_content.php',
			type: 'POST',
			success: function(response,status,xhr){
				//将文本格式转换为josn对象
				var josn = $.parseJSON(response);
				var html ="";
				var arr=[];
				$.each(josn ,function(index,value){
					html += '<h4>' + value.user + ' 发表于 ' + value.date + '</h4><h3>' + value.title + '</h3><div class="editor">' + value.content + '</div><div class="bottom">0条评论 <span class="down">显示全部</span><span class="up">收起</span></div><hr noshade="noshade" size="1" />';
				});
				$('.content').append(html);
				
				$.each($('.editor'), function (index, value) {
				arr[index] = $(value).height();
				if ($(value).height() > 155) {
					$(value).next('.bottom').find('.up').hide();
				}
				$(value).height(155);
				});
			
				$.each($('.bottom .down'), function (index, value) {
					$(this).click(function () {
						$(this).parent().prev().height(arr[index]);
						$(this).hide();
						$(this).parent().find('.up').show();
					});
				});
				
				$.each($('.bottom .up'), function (index, value) {
					$(this).click(function () {
						$(this).parent().prev().height(155);
						$(this).hide();
						$(this).parent().find('.down').show();
					});
				});
			},
		});
		
		
		//数据交互dialog
		
		
		//发布消息
		$('#question').dialog({
			autoOpen : false,
			modal : true,
			resizable : false,
			width : 500,
			height : 360,
			buttons : {
				'发布' : function () {
					$(this).ajaxSubmit({
						url:'add_content.php',
						type:'POST',
						data:{
							user : $.cookie('user'),
							content : $('.uEditorIframe').contents().find('#iframeBody').html(),
						},
						
						
						beforeSubmit:function(formData,jqForm,options){
							//submit成功之后，显示数据交互图片
							$('#loading').dialog('open');
							//widget找到整个对话框
							$('#question').dialog('widget').find('button').eq(1).button('disable');
						},
						success:function(responseText,statusText){
							//alert(responseText);	结果：1
							$('#question').dialog('widget').find('button').eq(1).button('enable');
							//数据交互成功之后
							$('#loading').css('backgrond','url(img/success.gif) no-repeat 20px center').html('数据新增成功');
							
							//新增成功之后，让两个dialog消失(1秒)
							setTimeout(function(){
							
							$('#loading').dialog('close');
							$('#question').dialog('close');
							$('#question').resetForm();
							$('.uEditorIframe').contents().find('#iframeBody').html('请输入数据描述');
							$('#loading').css('backgrond','url(img/loading.gif) no-repeat 20px center').html('数据交互中。。');
							
							},1000)
						
						},
						
					});
				}
			}
		});
		
		//对话框
		$('.uEditorCustom').uEditor();
		
		$('#error').dialog({
			width:180,
			height:50,
			autoOpen:false,
			modl:true,
			closeOnEscape:false,
			resizeable:false,
			draggable:false,
			
		}).parent().find('.ui-widget-header').hide();
		
		
		$('#reg_a').click(function(){
			$('#reg').dialog('open');
		});
		
		//数据交互dialog
		$('#loading').dialog({
			width:180,
			height:50,
			autoOpen:false,
			modl:true,
			closeOnEscape:false,
			resizeable:false,
			draggable:false,
			
		}).parent().find('.ui-widget-header').hide();
		
		
		
		//cookie设置
		$('#member,#logout').hide();
		if($.cookie('user')){
			$('#member,#logout').show();
			$('#reg_a,#login_a').hide();
			$('#member').html($.cookie('user'));
		}else{
			$('#member,#logout').hide();
			$('#reg_a,#login_a').show();	
		}
		
		//点击退出
		$('#logout').click(function(){
			$.removeCookie('user');
			window.location.href='../jquery_ajax_question/';
			
		});
		//cookie设置结束
	
		$('#reg').dialog({
			autoOpen : false,
			modal : true,
			resizable : false,
			width : 320,
			height : 340,
			buttons : {
				'提交' : function () {
					$(this).submit();
				}
			}
		}).buttonset().validate({
		
			submitHandler : function (form) {
				//表单提交
				$(form).ajaxSubmit({
					url:'add.php',
					type:'POST',
					
					beforeSubmit:function(formData,jqForm,options){
						//submit成功之后，显示数据交互图片
						$('#loading').dialog('open');
						//widget找到整个对话框
						$('#reg').dialog('widget').find('button').eq(1).button('disable');
					},
					success:function(responseText,statusText){
						//alert(responseText);	结果：1
						$('#reg').dialog('widget').find('button').eq(1).button('enable');
						//数据交互成功之后
						$('#loading').css('backgrond','url(img/success.gif) no-repeat 20px center').html('数据新增成功');
						
						//保存输入的用户值，设置为cookie
						$.cookie('user',$('#user').val());
						
						//新增成功之后，让两个dialog消失(1秒)
						setTimeout(function(){
							
							$('#loading').dialog('close');
							$('#reg').dialog('close');
							$('#reg').resetForm();
							$('#reg span.star').html('*').removeClass('succ');
							$('#loading').css('backgrond','url(img/loading.gif) no-repeat 20px center').html('数据交互中。。');
							
							//重复代码
							$('#member,#logout').show();
							$('#reg_a,#login_a').hide();
							$('#member').html($.cookie('user'));
							
						},1000)
						
					}
				});
					
			},
		
			showErrors : function (errorMap, errorList) {
				var errors = this.numberOfInvalids();
				
				if (errors > 0) {
					$('#reg').dialog('option', 'height', errors * 20 + 340);
				} else {
					$('#reg').dialog('option', 'height', 340);
				}
				
				this.defaultShowErrors();
			},
			
			highlight : function (element, errorClass) {
				$(element).css('border', '1px solid #630');
				$(element).parent().find('span').html('*').removeClass('succ');
			},
			
			unhighlight : function (element, errorClass) {
				$(element).css('border', '1px solid #ccc');
				$(element).parent().find('span').html('&nbsp;').addClass('succ');
			},
		
			errorLabelContainer : 'ol.reg_error',
			wrapper : 'li',
		
			rules : {
				user : {
					required : true,
					minlength : 2,
					//服务器端验证user是否重复
					remote:{
						url:'is_user.php',
						type:'POST',
					},
					
					/*remote : {
						url : 'user.php',
						type : 'GET',
					},*/
				},
				pass : {
					required : true,
					minlength : 6,
					/*//共同判断密码和账号，使用php来验证
					remote:{
						url:'user.php',
						data:{
							user:function(){
								return $('#user').val();
							},
						},
					},*/
				},
				email : {
					required : true,
					email : true
				},
				date : {
					date : true,
				},
			},
			messages : {
				user : {
					required : '帐号不得为空！',
					minlength : jQuery.format('帐号不得小于{0}位！'),
					remote : '帐号被占用！',
				},
				pass : {
					required : '密码不得为空！',
					minlength : jQuery.format('密码不得小于{0}位！'),
					remote : '请输入正确的账号或密码！',
				},
				email : {
					required : '邮箱不得为空！',
					minlength : '请输入正确的邮箱地址！',
				},	
			}
		});
		
		$('#date').datepicker({
			changeMonth : true,
			changeYear : true,
			yearSuffix : '',
			maxDate : 0,
			yearRange : '1950:2020',
	
		});
			
		
		$('#email').autocomplete({
			delay : 0,
			autoFocus : true,
			source : function (request, response) {
				//获取用户输入的内容
				//alert(request.term);
				//绑定数据源的
				//response(['aa', 'aaaa', 'aaaaaa', 'bb']);
				
				var hosts = ['qq.com', '163.com', '263.com', 'sina.com.cn','gmail.com', 'hotmail.com'],
					term = request.term,		//获取用户输入的内容
					name = term,				//邮箱的用户名
					host = '',					//邮箱的域名
					ix = term.indexOf('@'),		//@的位置
					result = [];				//最终呈现的邮箱列表
					
					
				result.push(term);
				
				//当有@的时候，重新分别用户名和域名
				if (ix > -1) {
					name = term.slice(0, ix);
					host = term.slice(ix + 1);
				}
				
				if (name) {
					//如果用户已经输入@和后面的域名，
					//那么就找到相关的域名提示，比如bnbbs@1，就提示bnbbs@163.com
					//如果用户还没有输入@或后面的域名，
					//那么就把所有的域名都提示出来
					
					var findedHosts = (host ? $.grep(hosts, function (value, index) {
							return value.indexOf(host) > -1
						}) : hosts),
						findedResult = $.map(findedHosts, function (value, index) {
						return name + '@' + value;
					});
					
					result = result.concat(findedResult);
				}
				
				response(result);
			},	
		});
		
		
		//会员登录login
	
		$('#login_a').click(function(){
			$('#login').dialog('open');
		});
		
		$('#login').dialog({
				autoOpen : false,
				modal : true,
				resizable : false,
				width : 320,
				height : 240,
				buttons : {
					'提交' : function () {
						$(this).submit();
					}
				}
			}).validate({
			
				submitHandler : function (form) {
					//表单提交
					$(form).ajaxSubmit({
						url:'login.php',
						type:'POST',
						
						beforeSubmit:function(formData,jqForm,options){
							//submit成功之后，显示数据交互图片
							$('#loading').dialog('open');
							//widget找到整个对话框
							$('#login').dialog('widget').find('button').eq(1).button('disable');
						},
						success:function(responseText,statusText){
							//alert(responseText);	结果：1
							$('#login').dialog('widget').find('button').eq(1).button('enable');
							//数据交互成功之后
							$('#loading').css('backgrond','url(img/success.gif) no-repeat 20px center').html('数据验证成功');
							
							//保存输入的用户值，设置为cookie
							if ($('#expires').is(':checked')) {
								$.cookie('user', $('#login_user').val(), {
									expires : 7,
								});
							} else {
								$.cookie('user', $('#login_user').val());
							}
							
							//新增成功之后，让两个dialog消失(1秒)
							setTimeout(function(){
								
								$('#loading').dialog('close');
								$('#login').dialog('close');
								$('#login').resetForm();
								$('#login span.star').html('*').removeClass('succ');
								$('#loading').css('backgrond','url(img/loading.gif) no-repeat 20px center').html('数据交互中');
								
								//重复代码
								$('#member,#logout').show();
								$('#reg_a,#login_a').hide();
								$('#member').html($.cookie('user'));
								
							},1000)
							
						}
					});
						
				},
			
			showErrors : function (errorMap, errorList) {
				var errors = this.numberOfInvalids();
				
				if (errors > 0) {
					$('#login').dialog('option', 'height', errors * 20 + 240);
				} else {
					$('#login').dialog('option', 'height', 240);
				}
				
				this.defaultShowErrors();
			},
			
			highlight : function (element, errorClass) {
				$(element).css('border', '1px solid #630');
				$(element).parent().find('span').html('*').removeClass('succ');
			},
			
			unhighlight : function (element, errorClass) {
				$(element).css('border', '1px solid #ccc');
				$(element).parent().find('span').html('&nbsp;').addClass('succ');
			},
		
			errorLabelContainer : 'ol.login_error',
			wrapper : 'li',
		
			rules : {
				login_user : {
					required : true,
					minlength : 2,
					//服务器端验证user是否重复
					
					
					/*remote : {
						url : 'user.php',
						type : 'GET',
					},*/
				},
				login_pass : {
					required : true,
					minlength : 6,
					//共同判断密码和账号，使用php来验证
					remote:{
						url:'login.php',
						type: 'POST',
						data:{
							login_user:function(){
								return $('#login_user').val();
							},
						},
					},
				},
				
			},
			messages : {
				login_user : {
					required : '帐号不得为空！',
					minlength : jQuery.format('帐号不得小于{0}位！'),

				},
				login_pass : {
					required : '密码不得为空！',
					minlength : jQuery.format('密码不得小于{0}位！'),
					remote: '账号或密码不正确!',
				},
				
			}
		});
	
	});






























