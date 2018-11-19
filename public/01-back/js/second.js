$(function () {

  var currentPage = 1; // 当前页
  var pageSize = 5; // 每页多少条

  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize,
      },
      datatype: "json",
      success: function (info) {
        console.log(info);
        var htmlStr = template("secondTpl", info)
        $("tbody").html(htmlStr);
        //  分页
        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3, //版本号
          totalPages: Math.ceil(info.total / info.size),
          currentPage: info.page,
          onPageClicked: function (a, b, c, page) {
            // 更新当前页
            currentPage = page;
            // 重新渲染
            render();
          }
        })
      }
    })
  };

  //2.点击添加按钮,  显示模态框
  $("#addBtn").click(function () {
    $("#addModal").modal("show");

    // 发送ajax请求, 获取下拉菜单的列表数据(全部的一级分类)
    // 通过分页获取一级分类的接口, 模拟获取全部数据的接口, page=1, pageSize: 100
     $.ajax({
        type: "get",
        url: "/category/queryTopCategoryPaging",
        data: {
          page: 1,
          pageSize: 100,
        },
        datatype: "json",
        success: function ( info ) {
           console.log( info );
          var htmlStr = template( "dropdownTpl", info);
          $(".dropdown-menu").html(htmlStr);
        }
     })

  })


   // 3. 给下拉菜单的所有 a 添加点击事件, 通过事件委托注册
   $('.dropdown-menu').on("click", "a", function() {
    // 获取 a 的文本
    var txt = $(this).text();
    // 将文本设置给 按钮
    $('#dropdownText').text( txt );

    // 获取 id, 设置给准备好的 input
    var id = $(this).data("id");
    $('[name="categoryId"]').val( id );

    // $('[name="categoryId"]').trigger("input");

    // 手动将 name="categoryId" 的校验状态, 改成 VALID 校验成功
    $('#form').data("bootstrapValidator").updateStatus("categoryId", "VALID")
  });

  // 4. 进行文件上传初始化
  $("#fileupload").fileupload({
    datatype: "json",
    done: function (e, data) {
      console.log(data);
      var result = data.result;
      var picUrl = result.picAddr;  
      $('#imgBox img').attr("src", picUrl );
      $('[name="brandLogo"]').val( picUrl );
      // 将 name="brandLogo" 的校验状态, 改成成功
      $("#form").data("bootstrapValidator").updateStatus("brandLogo", "VALID");
    }
  });

   // 5. 配置表单校验
  $('#form').bootstrapValidator({

    // 配置排序项, 默认会对隐藏域进行排除, 我们需要对隐藏域进行校验
    excluded: [],

    // 配置校验图标
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',    // 校验成功
      invalid: 'glyphicon glyphicon-remove',  // 校验失败
      validating: 'glyphicon glyphicon-refresh'  // 校验中
    },

    // 校验字段
    fields: {
      categoryId: {
        validators: {
          notEmpty: {
            message: "请选择一级分类"
          }
        }
      },

      brandName: {
        validators: {
          notEmpty: {
            message: "请输入二级分类名称"
          }
        }
      },

      brandLogo: {
        validators: {
          notEmpty: {
            message: "请选择图片"
          }
        }
      }
    }
  })

  // 6.表单效验 阻止默认跳转  发送ajax
  $("#form").on("success.form.bv", function (e) {
    e.preventDefault();

    $.ajax({
      type: "post",
      url: "/category/addSecondCategory",
      data: $("#form").serialize(),
      datatype: "json",
      success: function (info) {
        console.log(info);
        if (info.success) {
          $("#addModal").modal("hide");
          currentPage = 1;
          render();

          $("#form").data("bootstrapValidator").resetForm(true);
          $("#dropdownText").text("请选择一级分类");
          $("#imgBox img").attr("src", "./images/none.png");
        }
      }
    })
  })


})