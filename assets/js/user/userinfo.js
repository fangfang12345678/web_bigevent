const form = layui.form;

form.verify({
  nickname: (val) => {
    if (val.length > 6) return "昵称长度必须在 1 ~ 6 个字符之间！";
  },
});
//获取用户信息
const initUserInfo = function (val) {
  $.ajax({
    type: 'get',
    url: '/my/userinfo',
    success: function (res) {
      if (res.status !== 0) return layer.msg('获取用户信息成功')
      // console.log(res);
      form.val("formUserInfo", res.data);
    }
  })
}
//重置功能
$('#btnReset').click(function (e) {
  //阻止表单默认重置
  e.preventDefault();
  initUserInfo()
})
//更新功能
$('.layui-form').submit(function (e) {
  e.preventDefault();
  $.ajax({
    type: 'POST',
    url: "/my/userinfo",
    data: $(this).serialize(),
    success: function (res) {
      if (res.status !== 0) {
        return layer.msg("更新用户信息失败")
      } else {
        layer.msg("更新用户信息成功")
        // 在子页面调用父页面的函数
        window.parent.getUserInfo()
      }
    }
  })
})
initUserInfo()