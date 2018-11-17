;
 $(function () {

  var currentPage = 1; // 当前页
  var pageSize = 5; // 每页多少条

  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/category/queryTopCategoryPaging",
      data: {
        page: currentPage,
        pageSize: pageSize,
      },
      datatype: "json",
      success: function (info) {
        console.log(info);
        var htmlStr = template("firstTpl", info)
        $("tbody").html(htmlStr);

        $('#paginator').bootstrapPaginator({
          bootstrapMajorVersion: 3,
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
  }

  //2.点击添加按钮,  显示模态框
  $("#addBtn").click(function () {
    $("#addModal").modal("show");
  })

  // 3. 表单校验功能
  $('#form').bootstrapValidator({
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok', // 校验成功
      invalid: 'glyphicon glyphicon-remove', // 校验失败
      validating: 'glyphicon glyphicon-refresh' // 校验中
    },
    fields: {
      categoryName: {
        validators: {
          notEmpty: {
            message: "请输入一级分类"
          }
        }
      }

    }

  });

  // 表单效验 阻止默认跳转  发送ajax
  $("#form").on("success.form.bv", function (e) {
    e.preventDefault();

    $.ajax({
      type: "post",
      url: "/category/addTopCategory",
      data: $("#form").serialize(),
      datatype: "json",
      success: function (info) {
        console.log(info);
        if (info.success) {
          $("#addModal").modal("hide");
          currentPage = 1;
          render();

          $("#form").data("bootstrapValidator").resetForm(true);
        }
      }
    })
  })

});


