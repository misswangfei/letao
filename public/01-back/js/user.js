

;$(function () {
    var currentPage = 1; //当前页
    var pageSize = 5; //每页条数

    var currentId;  //当前正在修改的用户  ID
    var isDelete;  // 需要修改的状态

    render();
   function render() {
     $.ajax({
        type:"get",
        url: "/user/queryUser",
        data: {
          page: currentPage,
          pageSize: pageSize,
        },
        datatype: "json",
        success: function (info) {
          console.log(info);
            
          // 生成 htmlStr, 将来进行渲染
          // 参数1: 模板id, 参数2: 数据对象
          // 在模板中, 可以直接访问传进去对象中的所有属性
    
          var htmlStr = template("tmp",info)
          $('tbody').html(htmlStr);
          
          
          // 分页初始化
          $("#paginator").bootstrapPaginator({
           
            bootstrapMajorVersion:3,//版本号，
            
            currentPage:info.page,//当前页
            
            totalPages:Math.ceil(info.total / info.size),//总页数
            
            onPageClicked:function(a, b, c, page){
              //为按钮绑定点击事件 page:当前点击的按钮值
                currentPage = page;
                render();
        
            }
          });
        }
      })

       
    }
   


   // 给启用禁用按钮, 添加点击事件 (通过事件委托)
  // 事件委托: $('父元素').on("事件名称", "子元素", function() { .... })

  // 优点: 1. 可以给动态生成的元素, 绑定事件
  //       2. 可以进行批量注册事件, 性能效率更高
  

   $(".lt_content tbody").on("click", ".btn", function () {
       //显示模态框  
       $("#usertModal").modal("show");

        //获取用户 id
        currentId = $(this).parent().data("id");
        
        // 获取更改的状态 (根据按钮的类名判断)
        // 禁用按钮 ? 0 : 1
        isDelete = $(this).hasClass("btn-danger") ? 0 : 1;
         
      
        
   });

   $("#confirmBtn").click(function () {
       $.ajax({
         type:"post",
         url: "/user/updateUser",
         data: {
            id: currentId,
            isDelete: isDelete,
         },
         datatype: "json",
         success: function ( info ) {
             console.log(info);
             if (info.success) {
                $("#usertModal").modal("hide");
                render();
             }
             
         }
       })
   })

})