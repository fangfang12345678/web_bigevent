$(function () {
  const form = layui.form
  const laypage = layui.laypage
  const q = {
    pagenum: 1, //页码值
    pagesize: 2, //每页显示的条数
    cate_id: "", // 文章分类的 Id
    state: "", // 文章的发布状态
  };
  //获取表格数据
  const initTable = () => {
    $.ajax({
      type: "GET",
      url: "/my/article/list",
      data: q,
      success: function (res) {
        // console.log(res)
        if (res.status !== 0) {
          return
        }
        var htmlStr = template("tpl-table", res);
        $("tbody").html(htmlStr);
        renderPage(res.total)
      }

    })
  }
  //初始化文章分类的方法
  const initCate = () => {
    $.ajax({
      type: "GET",
      url: "/my/article/cates",
      success: function (res) {
        if (res.status !== 0) {
          return layer.msg('获取分类数据失败')

        }
        //调用模板引擎渲染分类的可选项
        var htmlStr = template("tpl-cate", res)
        $('[name="cate_id"]').html(htmlStr)
        form.render()

      }
    })
  }
  //筛选数据
  $('#form-search').submit(function (e) {
    e.preventDefault()
    q.cate_id = $('[name="cate_id"]').val()
    q.state = $('[name="state"]').val()

    console.log(q);
    initTable()
  })
  // 定义渲染分页的方法
  function renderPage(total) {
    // 调用 laypage.render() 方法来渲染分页的结构
    laypage.render({
      elem: 'pageBox', // 分页容器的 Id
      count: total, // 总数据条数
      limit: q.pagesize, // 每页显示几条数据
      curr: q.pagenum, // 设置默认被选中的分页
      layout: ['count', 'limit', 'prev', 'page', 'next', 'skip'],
      limits: [2, 3, 5, 10], // 每页展示多少条
      //jump触发条件
      //1.渲染的时候会先加载一次，此时first参数为true
      //2、切换页码的时候也会触发一次，此时first参数为undefined
      jump: (obj, first) => {
        console.log(first)
        console.log(obj);
        q.pagenum = obj.curr
        q.pagesize = obj.limit
        if (!first) {
          initTable()
        }
      }
    })
  }
  initCate()
  initTable()
  //删除文章
  $('tbody').on('click', '.btn-delete', function () {
    var len = $('.btn-delete').length
    //获取文章id
    var id = $(this).attr('data-id')
    //询问用户是否要删除数据
    layer.confirm('确认删除?', {
      icon: 3,
      title: '提示'
    }, function (index) {
      $.ajax({
        type: 'get',
        url: '/my/article/delete/' + id,
        success: function (res) {
          if (res.status !== 0) {
            return layer.msg('删除文章失败')
          }
          layer.msg('删除文章成功')
          // 当数据删除完成后，需要判断当前这一页中，是否还有剩余的数据
          // 如果没有剩余的数据了,则让页码值 -1 之后,
          // 再重新调用 initTable 方法
          // 4
          if (len === 1) {
            q.pagenum = q.pagenum === 1 ? 1 : q.pagenum - 1
          }
          initTable()
        }
      })
      layer.close()
    })
  })
  // 定义美化时间的过滤器
  template.defaults.imports.dataFormat = function (date) {
    const dt = new Date(date)

    var y = dt.getFullYear()
    var m = padZero(dt.getMonth() + 1)
    var d = padZero(dt.getDate())

    var hh = padZero(dt.getHours())
    var mm = padZero(dt.getMinutes())
    var ss = padZero(dt.getSeconds())

    return y + '-' + m + '-' + d + ' ' + hh + ':' + mm + ':' + ss
  }

  // 定义补零的函数
  function padZero(n) {
    return n > 9 ? n : '0' + n
  }
})