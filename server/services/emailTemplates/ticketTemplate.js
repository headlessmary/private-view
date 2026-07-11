const ticketTemplate = ({
  fullName,
  ticketType,
  reference,
}) => {
  return `
<!DOCTYPE html>
<html>

<head>
<meta charset="UTF-8">

<style>

*{
margin:0;
padding:0;
box-sizing:border-box;
}

body{
background:#f5f5f5;
font-family:Arial,Helvetica,sans-serif;
padding:40px 0;
}

.wrapper{
width:100%;
}

.container{
max-width:700px;
margin:auto;
background:#ffffff;
border-radius:18px;
overflow:hidden;
box-shadow:0 10px 35px rgba(0,0,0,.12);
}

/* HEADER */

.header{

background:#080808;

padding:70px 40px;

text-align:center;

}

.flyer{

width:530px;

max-width:90%;

margin-bottom:35px;

}

.header h1{

color:white;

font-size:38px;

font-family:Georgia,serif;

margin-bottom:15px;

}

.gold-line{

width:120px;

height:2px;

background:#D4A24D;

margin:25px auto;

}

.header p{

color:#D4A24D;

letter-spacing:5px;

font-size:13px;

text-transform:uppercase;

}

/* CONTENT */

.content{

padding:50px;

}

.content h2{

font-size:30px;

font-family:Georgia,serif;

color:#080808;

margin-bottom:25px;

}

.content p{

font-size:17px;

line-height:1.9;

color:#555;

margin-bottom:18px;

}

/* TICKET */

.ticket{

margin:45px 0;

border:2px solid #D4A24D;

border-radius:18px;

overflow:hidden;

}

.ticket-header{

background:#080808;

padding:25px;

text-align:center;

}

.ticket-header h3{

color:#D4A24D;

font-size:28px;

font-family:Georgia,serif;

letter-spacing:2px;

}

.ticket-body{

padding:35px;

background:#FBFAF7;

}

.info{

margin-bottom:22px;

}

.label{

display:block;

font-size:13px;

text-transform:uppercase;

letter-spacing:2px;

color:#888;

margin-bottom:6px;

}

.value{

font-size:20px;

font-weight:bold;

color:#080808;

}

.status{

display:inline-block;

margin-top:10px;

padding:10px 22px;

border-radius:30px;

background:#D4A24D;

color:#080808;

font-weight:bold;

}

/* QR */

.qr{

margin-top:40px;

text-align:center;

}

.qr-box{

display:inline-block;

padding:20px;

border:2px solid #D4A24D;

border-radius:15px;

background:white;

}

.qr img{

width:220px;

}

.qr p{

margin-top:20px;

font-size:15px;

color:#666;

}

/* EVENT */

.event{

margin-top:45px;

padding:30px;

background:#080808;

border-radius:14px;

}

.event h3{

color:#D4A24D;

font-family:Georgia,serif;

font-size:28px;

margin-bottom:25px;

text-align:center;

}

.event-row{

display:flex;

justify-content:space-between;

padding:12px 0;

border-bottom:1px solid rgba(255,255,255,.08);

color:white;

font-size:16px;

}

.event-row:last-child{

border-bottom:none;

}

.left{

color:#D4A24D;

font-weight:bold;

}

/* NOTICE */

.notice{

margin-top:45px;

padding:30px;

background:#FFF8E8;

border-left:5px solid #D4A24D;

border-radius:10px;

}

.notice h3{

margin-bottom:20px;

font-size:24px;

font-family:Georgia,serif;

color:#080808;

}

.notice ul{

padding-left:22px;

}

.notice li{

margin-bottom:14px;

line-height:1.7;

color:#555;

}

/* FOOTER */

.footer{

background:#080808;

padding:45px;

text-align:center;

}

.footer h2{

color:#D4A24D;

font-family:Georgia,serif;

font-size:30px;

margin-bottom:20px;

}

.footer p{

color:#bbbbbb;

line-height:1.8;

font-size:15px;

}

.copyright{

margin-top:30px;

font-size:13px;

color:#777;

}

</style>

</head>

<body>

<div class="wrapper">

<div class="container">

<div class="header">

<img
src="cid:flyer"
class="flyer"
/>

<h1>Your Ticket Is Confirmed</h1>

<div class="gold-line"></div>

<p>Art • Luxury • Experience</p>

</div>

<div class="content">

<h2>Hello ${fullName},</h2>

<p>

Thank you for reserving your place at
<strong>The Private View: Art & Indulgence.</strong>

</p>

<p>

We are delighted to confirm your registration.

Your payment has been received successfully and your digital admission pass is now ready.

</p>

<div class="ticket">

<div class="ticket-header">

<h3>PRIVATE VIEW PASS</h3>

</div>

<div class="ticket-body">

<div class="info">

<span class="label">Guest Name</span>

<span class="value">${fullName}</span>

</div>

<div class="info">

<span class="label">Ticket Type</span>

<span class="value">${ticketType}</span>

</div>

<div class="info">

<span class="label">Reference Number</span>

<span class="value">${reference}</span>

</div>

<div class="status">

✓ CONFIRMED

</div>

<div class="qr">

<div class="qr-box">

<img src="cid:qrcode"/>

</div>

<p>

Present this QR Code at the entrance.

Each ticket is valid for one admission only.

</p>

</div>

</div>

</div>

<div class="event">

<h3>Event Information</h3>

<div class="event-row">

<span class="left">Venue</span>

<span>Headless Mary Event Centre</span>

</div>

<div class="event-row">

<span class="left">Time</span>

<span>8:00 PM</span>

</div>

<div class="event-row">

<span class="left">Dress Code</span>

<span>Elegant / Smart Casual</span>

</div>

</div>

<div class="notice">

<h3>Before You Arrive</h3>

<ul>

<li>Doors open 30 minutes before the event.</li>

<li>Please keep this email available during check-in.</li>

<li>Your QR code can only be scanned once.</li>

<li>Do not share your QR code with anyone.</li>

<li>VIP guests should proceed through the VIP entrance.</li>

</ul>

</div>

</div>

<div class="footer">

<h2>We Look Forward To Welcoming You</h2>

<p>

An unforgettable evening of art, culture and indulgence awaits.

</p>

<div class="copyright">

© 2026 Headless Mary Events<br>

The Private View • All Rights Reserved

</div>

</div>

</div>

</div>

</body>

</html>
`;
};

module.exports = ticketTemplate;