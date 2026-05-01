"使用客户端";
进口 { useState } 从……起"反应";

出口 默认 功能 页() {
  Const [味精, setMsg]=useState("");
  Const [聊天, setChat]=useState([]);

  异步 功能 发送() {
    Constres=等候 取来("/api/聊天", {
      方法: "POST",
      页眉: { "内容类型": "应用程序/JSON" },
      身体: JSON.使字符串化({ 消息: 味精 }),
    });

    Const数据=等候 res.JSON();

    setChat([...聊天, { 角色: "用户", 文本: 味精 }, { 角色: "ai", 文本: 数据.reply }]);
    setMsg("");
  }

  返回 (
<div风格={{ padding: 20 }}>
<H2>龙虾AI</h2>

<div>
        {聊天.地图((c, 我)=>(
<p钥匙={我}>
<b>{c.角色}：</b>{c.text}
</p>
        ))}
</div>

<输入价值={味精} onChange={e=>setMsg(e.目标.价值)} />
<按钮onClick={发送}>发送</button>
</div>
  );
}
