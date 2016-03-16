<?php
	/*
	标题，描述，评论（用评论代替回答）
	
	*/
	
	sleep(1);
	
	require 'config.php';
	
	$query = "INSERT INTO question (title, content, user, date)
	         VALUES ('{$_POST['title']}', '{$_POST['content']}', '{$_POST['user']}', NOW())";
			 
	mysql_query($query) or die('新增失败！'.mysql_error());
	
	echo mysql_affected_rows();
	
	mysql_close();


?>