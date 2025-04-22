/**
 * 携带参数跳转至：隐私政策or用户协议子页面
 *  -termsType：条款种类
 *  -urlType：url种类
 */
function handleJumpToTerms(jumpParams) {
  var jumpUrl = ''
  if (jumpParams.termsType == 'privacy') {
    jumpUrl = jumpParams.urlType + '/privacy.html'
  }
  if (jumpParams.termsType == 'agreement') {
    jumpUrl = jumpParams.urlType + '/agreement.html'
  }
  var f = document.createElement('form');
  f.style.display = 'none';
  f.action = jumpUrl;
  f.method = 'post';
  f.innerHTML = '<input type="hidden" name="copyright" value="' + jumpParams.termsFullName + '"/><input type="hidden" name="abbreviation" value="' + jumpParams.termsAbbreviation + '"/>'
  document.body.appendChild(f);
  f.submit();
}

// 条款（隐私政策、用户协议）弹框
handleTermsPopup()

/**
 * 条款弹框（无跳转）：隐私政策or用户协议
 * 绑定事件：
 *  1.点击footer文字，显示弹框
 *  2.点击关闭按钮和遮罩（阻止冒泡），隐藏弹框
 */
function handleTermsPopup() {
  $('.read-terms').click(function () {
    var terms = $(this).data('terms')
    $('.popup-box').fadeIn()
    $('.show-' + terms).show().scrollTop(0, 0)
  })
  $('.popup-close').click(function () {
    $('.popup-box').hide()
    $('.show-agreement').hide()
    $('.show-privacy').hide()
    $('.show-function').hide()
  })
  $('.popup-box').click(function () {
    $('.popup-close').click()
  })
  $('.popup-content').click(function (e) {
    e.stopPropagation()
  })
}


// 判断是否为移动端
function isMobile() {
  if (window.navigator.userAgent.match(/(phone|pad|pod|iPhone|iPod|ios|iPad|Android|Mobile|BlackBerry|IEMobile|MQQBrowser|JUC|Fennec|wOSBrowser|BrowserNG|WebOS|Symbian|Windows Phone)/i)) {
    return true; // 移动端
  } else {
    return false
  }
}

// 获取当前年份
var date = new Date();
$('.fullyear').text(date.getFullYear())


function privacyTencent(TencentConfig) {
  const { term_company, term_company_abbr, privacyText, permissionsText, enable } = TencentConfig
  if (enable == 1) {
    if (privacyText !== '') {
      $(".show-privacy .agreement").html(privacyText)
    } else {
      $(".show-privacy .agreement").html(`
        <div class="agreement">
        <h1><span class="term_company">${term_company}</span>隐私政策</h1>
        <p>
        我们会收集您在使用本网站时向我们提供的个人数据（"个人数据"），可能包括您的姓名、住址、电话号码、付款账户信息或邮箱地址。我们亦会收集那些和您账户有关的非个人识别信息，包括您的登录名、IP地址和密码。 为了防止他人未经授权访问您的个人数据，我们会采取合理的措施来保护您的个人数据，以防您的个人数据受到意外的、非法的侵害或损失或个人数据遭到更改或被未经授权的他人访问及披露。
        </p>
        </div>`
      )
    }


    $(".show-agreement .agreement").html(`
    <div class="agreement">
    <h1><span class="term_company_abbr">${term_company_abbr}</span>用户权限</h1>
    <p>1. 准许用户使用我们的软件进行${permissionsText}。</p>
    <p>2. 准许用户使用手机验证码，微信扫码等软件准许的方式登录软件</p>
    <p>3. 准许用户安装，卸载，支付，注册等软件准许的使用行为</p>
    <p>4. 准许本软件获取手机号码，微信等用于登录</p>
    </div>
    `)
  }

}

function reuseTemplateLogic(ocpcType, headerType) {
  var ocpc_type = parseInt('{$ocpc_type}') 
  const ocpcArray = ['', 6, 4, 26]
  if (ocpcType) ocpc_type = Number(ocpcType)
  $("a[data-agl-cvt]").each(async function () {
    await $(this).attr('data-agl-cvt', `${ocpcArray[ocpc_type]}`)
  })

  var is_aggregation_page = parseInt('{$is_aggregation_page}')
  if (headerType) is_aggregation_page = Number(headerType)
  if (is_aggregation_page == 1) {  
    const str = `
        <img src="/static/common/imgs/logo.svg" alt="" />
        <div class="header-title">
          <h1 id="header-title-h1">金舟软件</h1>
          <span>客服热线：0752-7217110</span>
        </div>
      `
    $(".header-left").html(str)
    $(".header-left").addClass("aggregate_style")
    $(".header-left").attr('href', "/")
    $(".header-left").attr('target', "_blank")
  }
}

function stabilization(config) {
  const { triggerHeight, gaussianBlur } = config
  if ($(this).scrollTop() == 0) $(".hidden-header-box").hide();

  let timer;
  const tHeight = Number(triggerHeight) || 120
  $(document).scroll(function () {
    if (timer) clearInterval(timer)
    timer = setTimeout(function () {
      const scrollTop = $(this).scrollTop();
      scrollTop >= tHeight ? $(".hidden-header-box").fadeIn() : $(".hidden-header-box").fadeOut();
    }, 250);
  });

  // 高斯模糊
  if (gaussianBlur.enable) {
    const { maxThreshold, minThreshold, className } = gaussianBlur
    $(window).scroll(function () {
      const scrollTop = $(this).scrollTop();
      if (scrollTop >= minThreshold && scrollTop <= maxThreshold) {
        $(".hidden-header-box").addClass(className)
      } else {
        $(".hidden-header-box").removeClass(className)
      }
    });

  }
}


async function linkageName(config) {
  const urlParams = new URLSearchParams(window.location.search);
  const currentParams = {};
  const paramKeys = ['jx', 'xl'];
  for (const key of paramKeys) {
    if (urlParams.has(key)) {
      await parseAdgroupId(urlParams.get(key));
    }
  }
  async function parseAdgroupId(value) {
    const mappings = {
      s: 'plat_id',
      a: 'user_id',
      p: 'campaign_id',
      g: 'adgroup_id',
      k: 'keyword_id',
      c: 'creative_id',
    };

    value.split('.').forEach(segment => {
      let [name, val] = [segment[0], segment.slice(1)];
      if (['m', 'd', 'a'].includes(name)) return;
      if (name === 't') {
        name = 's';
        val = parseInt(val) + 1;
      } else {
        val = parseInt(val);
      }

      if (mappings[name]) currentParams[mappings[name]] = val;
    });
  }
  const { expandName, defaultProductName, linkageAdgroupList, debugging } = config

  const materialName = expandName !== 'null'
    ? expandName 
    : linkageAdgroupList[currentParams.adgroup_id]?.product_name || defaultProductName;
  $(".material-name").text(materialName)

  if (debugging) {
    if (expandName !== 'null') {
      console.log('拓展名称:', materialName);
    } else {
      console.log(linkageAdgroupList[adgroupId]?.product_name ? '联动名称' : '默认名称', materialName);
    }
  }
}



// 每星期一早上8点以后访问才更新时间
function updateTime() {
  var now = new Date()
  var getDay = now.getDay()
  getDay = getDay == 0 ? 7 : getDay
  var mondayTimes = now - 1000 * 3600 * 24 * (getDay - 1)
  var hour = now.getHours()
  var min = now.getMinutes()
  var seconds = now.getSeconds()

  if (hour >= 8 && min >= 0 && seconds >= 0) { // 如果访问页面的时间是早上8点以后，才更新时间
    var mondayDate = getFormatDate(mondayTimes)
    $('.update-time').text(mondayDate)
  }

  function getFormatDate(times) { // 获取星期一的日期：yyyy-MM-dd
    var now = new Date(times)
    var year = now.getFullYear()
    var month = now.getMonth()
    var day = now.getDate()
    month = month < 9 ? '0' + (month + 1) : month + 1
    day = day < 10 ? '0' + day : day
    var date = year + '-' + month + '-' + day
    return date
  }
}




// 按时间间隔加数字
function usageNum(type) {
  var view_no
  if (type == 'totalNum') {
    view_no = parseInt((new Date().getTime() - 1736292270218) / 10000)
  } else {
    view_no = parseInt((new Date().getTime() - 1632631069036) / 10000)
  }
  return view_no
}
$('.total-num').text(toThousands(usageNum('totalNum')))
$('.zhuanhuan-num').text(toThousands(usageNum('zhuanhuanNum')))

// 计算总和
function handleNum(type) {
  var getNowNum = $('.total-num').text()
  var getzhuanhuanNum = $('.zhuanhuan-num').text()
  if (type == 'click') {
    var calNum = getNum(getNowNum) + 1
    var zhuanhuanCalNum = getNum(getzhuanhuanNum) + 6
  } else {
    var calNum = usageNum('totalNum')
    var zhuanhuanCalNum = usageNum('zhuanhuanNum') + 6
  }
  var numToStr = toThousands(calNum)
  var zhuanhuanNumToStr = toThousands(zhuanhuanCalNum)
  $('.total-num').text(numToStr)
  $('.zhuanhuan-num').text(zhuanhuanNumToStr)
}
handleNum('autoAdd')
// 点击触发计算
$('.download-total').click(function () {
  handleNum('click')
})

// 每10秒触发一次计算
var timer
clearInterval(timer)
timer = setInterval(function () {
  var getNowNum = $('.total-num').text()
  var getzhuanhuanNum = $('.zhuanhuan-num').text()
  var calNum = getNum(getNowNum) + 1
  var zhuanhuanCalNum = getNum(getzhuanhuanNum) + 6
  var numToStr = toThousands(calNum)
  var zhuanhuanNumToStr = toThousands(zhuanhuanCalNum)
  $('.total-num').text(numToStr)
  $('.zhuanhuan-num').text(zhuanhuanNumToStr)
}, 10000)

// 去掉字符串中出现的所有逗号
function getNum(str) {
  var num = parseInt(str.replace(/,/g, ""))
  return num;
}

// 数字转字符串，每三位一个逗号
function toThousands(num) {
  return num.toString().replace(/\d+/, function (n) {
    return n.replace(/(\d)(?=(?:\d{3})+$)/g, '$1,')
  })
}