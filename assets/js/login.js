$(function () {
  $('#link_reg').click(function () {
    $(".login-box").hide()
    $('.reg-box').show()
  })
  $('#link_login').click(function () {
    $(".login-box").show()
    $('.reg-box').hide()
  })
  //引入form模块
  const form = layui.form;
  const layer = layui.layer;
  //自定义form.verify()检验规则
  form.verify({
    pwd: [/^[\S]{6,12}$/, "密码必须6到12位，且不能出现空格"],
    //校验两次密码是否一致的规则
    repwd: (value) => {
      //通过形参拿到确认密码框的内容
      const pwd = $("#form_reg [name=password]").val()
      console.log(pwd);
      console.log(value);
      if (pwd !== value) {
        return "两次密码不一致"
      }
    }
  })
  //设置根路径
  // const baseUrl = 'http://www.liulongbin.top:3007'
  //监听注册表单的提交事件
  $('#form_reg').on('submit', function (e) {
    //1、阻止默认提交行为
    e.preventDefault()
    //2、发起Ajax请求
    $.ajax({
      type: 'POST',
      url: '/api/reguser',
      data: {
        username: $("#form_reg [name=username]").val(),
        password: $("#form_reg [name=password]").val(),

      },

      success: function (res) {
        if (res.status !== 0) return layer.msg("注册失败")
        layer.msg("注册成功")
        //模拟点击跳转登录
        $("#link_login").click()
      }
    })
  })
  //登录功能
  $("#form_login").on("submit", function (e) {
    e.preventDefault()
    $.ajax({
      type: "POST",
      url: "/api/login",
      data: $(this).serialize(),
      success: function (res) {
        if (res.status !== 0) return layer.msg("登陆失败");
        layer.msg("登陆成功")

        localStorage.setItem("token", res.token)
        console.log(res.token);
        location.href = "/index.html"
      }
    })
  })
})