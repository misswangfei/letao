/*
 * 1. 进行表单校验配置
 *    校验要求:
 *        (1) 用户名不能为空, 长度为2-6位
 *        (2) 密码不能为空, 长度为6-12位
 * */
;
$(function () {

  //使用表单校验插件
  $("#form").bootstrapValidator({
    //图标显示效验
    feedbackIcons: {
      valid: 'glyphicon glyphicon-ok',
      invalid: 'glyphicon glyphicon-remove',
      validating: 'glyphicon glyphicon-refresh'
    },

    //字段效验
    fields: {
      //校验用户名，对应name表单的name属性
      username: {
        validators: {
          //不能为空
          notEmpty: {
            message: '用户名不能为空'
          },
          //长度校验
          stringLength: {
            min: 2,
            max: 6,
            message: '用户名长度必须在2到6之间'
          },
          callback: {
            message: "用户不存在",
          }
        },
      },
      password: {
        validators: {
          //不能为空
          notEmpty: {
            message: '密码不能为空'
          },
          //长度校验
          stringLength: {
            min: 6,
            max: 12,
            message: '密码长度必须在6到12之间'
          },
          callback: {
            message: "密码错误",
          }
        },
      }
    }
  })



  $("#form").on('success.form.bv', function (e) {
    e.preventDefault();
    $.ajax({
      type: "post",
      url: "/employee/employeeLogin",
      data: $("#form").serialize(),
      datatype: "json",
      success: function (info) {
        if (info.success) {
          //  alert("登录成功")
          location.href = "01-index.html";
        }
        if (info.error === 1000) {
          //  alert("用户名不存在")
          $("#form").data("bootstrapValidator").updateStatus("username", "INVALID", "callback");
        }
        if (info.error === 1001) {
          //  alert("密码错误")
          $("#form").data("bootstrapValidator").updateStatus("password", "INVALID", "callback");

        }
      }
    })
  });


  $('[type="reset"]').click(function () {
    console.log(111);
    $("#form").data("bootstrapValidator").resetForm();
  })

});