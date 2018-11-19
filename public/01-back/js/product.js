$(function() {
  var currentPage = 1; // 当前页
  var pageSize = 5; // 每页多少条
  var picArr = []; // 储存所有的用于上传的图片对象

  render();

  function render() {
    $.ajax({
      type: "get",
      url: "/product/queryProductDetailList",
      data: {
        page: currentPage,
        pageSize: pageSize
      },
      datatype: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template("productTpl", info);
        $("tbody").html(htmlStr);
        //  分页
        $("#paginator").bootstrapPaginator({
          bootstrapMajorVersion: 3, //版本号
          totalPages: Math.ceil(info.total / info.size),
          currentPage: info.page,
          onPageClicked: function(a, b, c, page) {
            // 更新当前页
            currentPage = page;
            // 重新渲染
            render();
          }
        });
      }
    });
  }

  //2.点击添加按钮,  显示模态框
  $("#addBtn").click(function() {
    $("#addModal").modal("show");

    // 通过分页获取二级分类的接口, 模拟获取全部数据的接口, page=1, pageSize: 100
    $.ajax({
      type: "get",
      url: "/category/querySecondCategoryPaging",
      data: {
        page: 1,
        pageSize: 100
      },
      datatype: "json",
      success: function(info) {
        console.log(info);
        var htmlStr = template("dropdownTpl", info);
        $(".dropdown-menu").html(htmlStr);
      }
    });
  });

  // 3. 给下拉菜单的所有 a 添加点击事件, 通过事件委托注册
  $(".dropdown-menu").on("click", "a", function() {
    // 获取 a 的文本
    var txt = $(this).text();
    // 将文本设置给 按钮
    $("#dropdownText").text(txt);

    // 获取 id, 设置给准备好的 input
    var id = $(this).data("id");
    $('[name="brandId"]').val(id);

    // 手动将 name="brandId" 的校验状态, 改成 VALID 校验成功
    $("#form")
      .data("bootstrapValidator")
      .updateStatus("brandId", "VALID");
  });

  // 4. 进行文件上传初始化
  $("#fileupload").fileupload({
    datatype: "json",
    done: function(e, data) {
      console.log(data);

      var picObj = data.result; //后台返回的结果 (图片名称/图片地址)
      var picUrl = picObj.picAddr; //图片地址

      //往数组的最前面追加
      picArr.unshift(picObj);

      //结构上, 往最前面追加
      $("#imgBox").prepend('<img src="' + picUrl + '" style="height:100px">');
      if (picArr.length > 3) {
        // 将最前面的保留, 将最后面移除,
        // 移除数组最后一项
        picArr.pop();
        // 移除图片结构中最后一个图片, 找最后一个图片类型的元素, 进行删除, 让他自杀
        $("#imgBox img:last-of-type").remove();
      }
      if (picArr.length === 3) {
        $("#form")
          .data("bootstrapValidator")
          .updateStatus("picStatus", "VALID");
      }
    }
  });

  //5 点击上架或者下架  显示模态框
  $(".lt_content tbody").on("click", ".btn", function() {
    //显示模态框
    $("#productModal").modal("show");
  });

  //6. 进行表单校验初始化
  $("#form").bootstrapValidator({
    // 配置排序项, 默认会对隐藏域进行排除, 我们需要对隐藏域进行校验
    excluded: [],

    // 配置校验图标
    feedbackIcons: {
      valid: "glyphicon glyphicon-ok", // 校验成功
      invalid: "glyphicon glyphicon-remove", // 校验失败
      validating: "glyphicon glyphicon-refresh" // 校验中
    },

    // 校验字段
    fields: {
      brandId: {
        validators: {
          notEmpty: {
            message: "请选择二级分类"
          }
        }
      },
      proName: {
        validators: {
          notEmpty: {
            message: "请输入商品名称"
          }
        }
      },
      proDesc: {
        validators: {
          notEmpty: {
            message: "请输入商品描述"
          }
        }
      },
      num: {
        validators: {
          notEmpty: {
            message: "请输入商品库存"
          },
          regexp: {
            regexp: /^[1-9]\d*$/,
            message: "请输入非零开头的数字"
          }
        }
      },
      size: {
        validators: {
          notEmpty: {
            message: "请输入商品尺码"
          },
          // 校验需求: 必须是 xx-xx 的格式,  xx两位数字
          regexp: {
            regexp: /^\d{2}-\d{2}$/,
            message: "必须是 xx-xx 的格式,  xx两位数字"
          }
        }
      },
      oldPrice: {
        validators: {
          notEmpty: {
            message: "请输入商品原价"
          }
        }
      },
      price: {
        validators: {
          notEmpty: {
            message: "请输入商品现价"
          }
        }
      },
      // 专门用于标记文件上传是否满 3张 的
      picStatus: {
        validators: {
          notEmpty: {
            message: "请上传3张图片"
          }
        }
      }
    }
  });

  // 7. 注册表单校验成功事件, 阻止默认的提交, 通过 ajax 提交
  $("#form").on("success.form.bv", function(e) {
    e.preventDefault();

    var params = $("#form").serialize(); //获取所有 input 中的数据
    console.log(picArr);
    // 还要加上图片的数据
    // params += "&picName1=xx&picAddr1=xx"
    params +=
      "&picName1=" + picArr[0].picName + "&picAddr1=" + picArr[0].picAddr;
    params +=
      "&picName2=" + picArr[1].picName + "&picAddr2=" + picArr[1].picAddr;
    params +=
      "&picName3=" + picArr[2].picName + "&picAddr3=" + picArr[2].picAddr;

    $.ajax({
      type: "post",
      url: "/product/addProduct",
      data: params,
      datatype: "json",
      success: function(info) {
        console.log(info);
        if (info.success) {
          // 关闭模态框
          $("#addModal").modal("hide");
          //重新渲染第一页
          currentPage = 1;
          render();
          // 重置内容和状态
          $("#form")
            .data("bootstrapValidator")
            .resetForm(true);
          // 重置下拉按钮 和 图片内容
          $("#dropdownText").text("请选择二级分类");
          $("#imgBox img").remove();
          // 清空数组
          picArr = [];
        }
      }
    });
  });
});
