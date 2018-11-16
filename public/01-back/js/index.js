
 ;$(function () {
   

   // 基于准备好的dom，初始化echarts实例
    var echarts_left = echarts.init(document.querySelector(".echarts_left"));
  
    // 指定图表的配置项和数据
    var option1 = {
      // 大标题
      title: {
        // 文本
        text: '2018年注册人数'
      },
      // 提示框组件
      tooltip: {
        // 表示坐标轴触发
        //trigger: "axis"
        trigger: "item"
      },
      // 图例
      legend: {
        data:['销量']
      },
      // x轴的数据
      xAxis: {
        data: ["1月", "2月", "3月", "4月", "5月", "6月"]
      },
      // y轴的刻度, y轴刻度不进行设置, y轴会自动根据数据最大值生成合适的刻度
      yAxis: {},
      // 数据
      series: [{
        name: '销量',
        // bar 表示柱状图,  line 表示折线图,  pie 表示饼图
        type: 'bar',
        data: [100, 150, 90, 58, 80, 30]
      }]
    };
  
    // 使用刚指定的配置项和数据显示图表。
    echarts_left.setOption(option1);
  
  
  
    var echarts_right = echarts.init(document.querySelector(".echarts_right"));
  
    option2 = {
      title : {
          text: '热门品牌销售',
          subtext: '2018年11月',
          x:'center'
      },
      tooltip : {
          trigger: 'item',
          formatter: "{a} <br/>{b} : {c} ({d}%)"
      },
      legend: {
          orient: 'vertical',
          left: 'left',
          data: ['耐克','阿迪王','阿迪','回力','老北京']
      },
      series : [
          {
              name: '访问来源',
              type: 'pie',
              radius : '55%',
              center: ['50%', '60%'],
              data:[
                  {value:335, name:'耐克'},
                  {value:310, name:'阿迪王'},
                  {value:234, name:'阿迪'},
                  {value:135, name:'回力'},
                  {value:1548, name:'老北京'}
              ],
              itemStyle: {
                  emphasis: {
                      shadowBlur: 10,
                      shadowOffsetX: 0,
                      shadowColor: 'rgba(0, 0, 0, 0.5)'
                  }
              }
          }
      ]
  };
   // 使用刚指定的配置项和数据显示图表。
   echarts_right.setOption(option2);

 });
 
 
