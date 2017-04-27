$(function(){
	$('.comment').click(function(e){
		var target=$(this);
		var commentId=target.data('cid');
		var toId=target.data('tid');

		//如果已经点过头像，生成了一个todo input，则只更新value为最新的值
		if($('#toId').length>0){
			$('#toId').val(toId)
		}else{  //如果没有点过头像，没有todo input，则生成
			$('<input>').attr({
				type:'hidden',
				id:'toId',
				name:'comment[tid]',
				value:toId
			}).appendTo('#commentForm')
		}

		if($('#commentId').length>0){
			$('#commentId').val(commentId)
		}else{
			$('<input>').attr({
				type:'hidden',
				id:'commentId',
				name:'comment[cid]',
				value:commentId
		    }).appendTo('#commentForm')
		}
		
	})
})