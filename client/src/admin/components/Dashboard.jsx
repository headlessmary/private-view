import { useCallback, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { io } from "socket.io-client";
import API_URL from "../../config/api";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Pie,
  PieChart,
  RadialBar,
  RadialBarChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

export default function Dashboard() {
  const navigate = useNavigate();

  const [loading, setLoading] = useState(true);
  const [attendees, setAttendees] = useState([]);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState("ALL");
  const [selectedAttendee, setSelectedAttendee] = useState(null);
  const [sendingEmail, setSendingEmail] = useState(false);

  const [stats, setStats] = useState({
    totalTickets: 0,
    vipTickets: 0,
    regularTickets: 0,
    checkedIn: 0,
    remainingTickets: 0,
    revenue: 0,
  });

  const fetchAttendees = useCallback(async () => {
    const token = localStorage.getItem("adminToken");

    const response = await fetch(`${API_URL}/api/admin/attendees`, {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await response.json();

    if (!response.ok) {
      throw new Error(data.message || "Failed to fetch attendees");
    }

    setAttendees(data.attendees || []);
  }, []);

  const fetchDashboard = useCallback(async () => {
    try {
      const response = await fetch(`${API_URL}/api/admin/dashboard`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Failed to load dashboard");
      }

      setStats(data.data);
      await fetchAttendees();
    } catch (error) {
      alert(error.message);
      if (error.message.toLowerCase().includes("token")) {
        navigate("/admin/login");
      }
    } finally {
      setLoading(false);
    }
  }, [fetchAttendees, navigate]);

  useEffect(() => {
    const loadDashboard = async () => {
      await fetchDashboard();
      await fetchAttendees();
    };

    const socket = io(API_URL, {
      transports: ["websocket"],
      reconnection: true,
    });

    socket.on("connect", () => {
      loadDashboard();
    });

    const refreshDashboard = () => {
      loadDashboard();
    };

    const events = [
      "attendee:created",
      "attendee:registered",
      "attendee:updated",
      "attendee:checked-in",
      "checkin:updated",
      "check-in:updated",
      "dashboard:updated",
      "dashboard:refresh",
      "admin:dashboard:update",
      "admin:attendee:update",
    ];

    events.forEach((eventName) => socket.on(eventName, refreshDashboard));

    loadDashboard();

    return () => {
      events.forEach((eventName) => socket.off(eventName, refreshDashboard));
      socket.disconnect();
    };
  }, [fetchAttendees, fetchDashboard]);

  const logout = () => {
    localStorage.removeItem("adminToken");
    localStorage.removeItem("admin");
    navigate("/admin/login");
  };

  const filteredAttendees = attendees.filter((person) => {
    const keyword = search.toLowerCase();

    const matchSearch =
      person.fullName?.toLowerCase().includes(keyword) ||
      person.email?.toLowerCase().includes(keyword) ||
      person.phone?.includes(search);

    const matchFilter = filter === "ALL" || person.ticketType === filter;

    return matchSearch && matchFilter;
  });

  const recentCheckins = attendees.filter((person) => person.checkedIn).slice(0, 5);
  const vipCount = attendees.filter((person) => person.ticketType === "VIP").length;
  const regularCount = attendees.filter((person) => person.ticketType === "REGULAR").length;
  const capacityPercent = Math.min(100, Math.round((stats.checkedIn / 60) * 100));
  
  // eslint-disable-next-line no-unused-vars
  const regularShare = attendees.length ? Math.round((regularCount / attendees.length) * 100) : 0;
  const checkInPercent = Math.min(100, Math.round((stats.checkedIn / 60) * 100));
  const revenueSeries = [
    { name: "Mon", revenue: Math.max(0, stats.revenue * 0.28) },
    { name: "Tue", revenue: Math.max(0, stats.revenue * 0.35) },
    { name: "Wed", revenue: Math.max(0, stats.revenue * 0.3) },
    { name: "Thu", revenue: Math.max(0, stats.revenue * 0.42) },
    { name: "Fri", revenue: Math.max(0, stats.revenue * 0.51) },
    { name: "Sat", revenue: Math.max(0, stats.revenue * 0.62) },
  ];
  const distributionData = [
    { name: "VIP", value: vipCount, color: "#d4a24d" },
    { name: "Regular", value: regularCount, color: "#7c4f12" },
  ];
  const checkInData = [{ name: "Check-in", value: checkInPercent, fill: "#f1ca7b" }];

  const downloadFile = async (type) => {
    const response = await fetch(`${API_URL}/api/admin/export/${type}`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
      },
    });

    if (!response.ok) {
      const data = await response.json();
      throw new Error(data.message || `Failed to download ${type}`);
    }

    const blob = await response.blob();
    const url = window.URL.createObjectURL(blob);
    const link = document.createElement("a");

    link.href = url;
    link.download = `attendees.${type}`;
    link.click();

    window.URL.revokeObjectURL(url);
  };

  const handleDownloadTicket = async () => {
    if (!selectedAttendee?.qrCode) {
      alert("No ticket available to download.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}${selectedAttendee.qrCode}`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
      });

      if (!response.ok) {
        throw new Error("Failed to download ticket");
      }

      const blob = await response.blob();
      const url = window.URL.createObjectURL(blob);
      const link = document.createElement("a");

      link.href = url;
      link.download = `ticket-${selectedAttendee.reference || selectedAttendee.id || "attendee"}.png`;
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      alert(error.message);
    }
  };

  const resendTicket = async (reference) => {
    try {
      setSendingEmail(true);

      const response = await fetch(
        `${API_URL}/api/admin/resend-ticket`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
          },
          body: JSON.stringify({
            reference,
          }),
        }
      );

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message);
      }

      alert("✅ Ticket email has been resent successfully.");
    } catch (error) {
      alert(`❌ ${error.message}`);
    } finally {
      setSendingEmail(false);
    }
  };

  // eslint-disable-next-line no-unused-vars
  const handleResendTicketEmail = async () => {
    if (!selectedAttendee?.id) {
      alert("No attendee selected.");
      return;
    }

    try {
      const response = await fetch(`${API_URL}/api/admin/resend-ticket`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("adminToken")}`,
        },
        body: JSON.stringify({ attendeeId: selectedAttendee.id }),
      });

      const data = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(data.message || "Failed to resend ticket email");
      }

      alert(data.message || "Ticket email sent successfully.");
    } catch (error) {
      alert(error.message);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-black text-white flex items-center justify-center text-xl">
        Loading Dashboard...
      </div>
    );
  }

  return (
    <section className="min-h-screen bg-black text-white p-3 sm:p-6 lg:p-8">
      <header className="border-b border-[#1c1308] bg-[#050505]">
        <div className="mx-auto flex max-w-7xl flex-col gap-5 px-4 py-5 sm:flex-row sm:items-center sm:justify-between sm:px-6 sm:py-6 lg:px-8">
          <div className="flex flex-col items-start">
            <h1 className="text-2xl font-serif text-[#d4a24d] sm:text-3xl lg:text-4xl">
              The Private View
            </h1>

            <p className="mt-2 text-sm text-gray-500 sm:text-base">Art & Indulgence</p>
          </div>

          <div className="flex flex-wrap items-center gap-2 text-sm sm:gap-6 sm:text-base">
            <button
              onClick={() => navigate("/admin/scanner")}
              className="text-white transition hover:text-[#d4a24d]"
            >
              Check-in Scanner →
            </button>

            <button
              onClick={() => navigate("/admin/settings")}
              className="text-white transition hover:text-[#d4a24d]"
            >
              Settings
            </button>

            <button
              onClick={logout}
              className="text-gray-400 transition hover:text-red-400"
            >
              Sign out
            </button>
          </div>
        </div>
      </header>

      <div className="mx-auto max-w-7xl px-4 pt-6 sm:px-6 sm:pt-10 lg:px-8">
        <h2 className="text-2xl font-serif text-white sm:text-3xl lg:text-4xl">
          {new Date().getHours() < 12
            ? "Good Morning,"
            : new Date().getHours() < 17
            ? "Good Afternoon,"
            : "Good Evening,"}
        </h2>

        <p className="text-[#d4a24d] mt-2 text-lg">Administrator</p>

        <p className="text-gray-500 mt-1">
          {new Date().toLocaleDateString("en-NG", {
            weekday: "long",
            month: "long",
            day: "numeric",
            year: "numeric",
          })}
        </p>
      </div>

      <div className="mx-auto max-w-7xl px-4 py-6 sm:px-6 sm:py-8 lg:px-8 lg:py-10">
        <div className="grid gap-6 xl:grid-cols-[280px_minmax(0,1fr)] xl:gap-8">
          <aside className="space-y-6">
            <div className="bg-[#0b0907] border border-[#2d1e09] rounded-2xl p-6">
              <p className="uppercase tracking-[0.35em] text-[#d4a24d] text-xs font-semibold">
                Live activity
              </p>

              <div className="mt-4 space-y-3">
                {recentCheckins.length > 0 ? (
                  recentCheckins.map((person) => (
                    <div key={person.id} className="flex items-center justify-between rounded-xl bg-[#140f0a] px-3 py-2">
                      <div>
                        <p className="text-sm text-white">{person.fullName}</p>
                        <p className="text-xs text-gray-500">{person.ticketType}</p>
                      </div>
                      <span className="text-xs text-[#d4a24d]">Checked in</span>
                    </div>
                  ))
                ) : (
                  <p className="text-sm text-gray-500">No check-ins yet.</p>
                )}
              </div>
            </div>

            <div className="bg-[#0b0907] border border-[#2d1e09] rounded-2xl p-6">
              <p className="uppercase tracking-[0.35em] text-[#d4a24d] text-xs font-semibold">
                Quick links
              </p>

              <div className="mt-4 space-y-2">
                <button
                  onClick={() => navigate("/admin/scanner")}
                  className="w-full rounded-xl border border-[#2d1e09] bg-[#16110b] px-4 py-3 text-left text-sm text-white hover:border-[#d4a24d]"
                >
                  Scan check-ins
                </button>
                <button
                  onClick={() => downloadFile("excel")}
                  className="w-full rounded-xl border border-[#2d1e09] bg-[#16110b] px-4 py-3 text-left text-sm text-white hover:border-[#d4a24d]"
                >
                  Export guest list
                </button>
              </div>
            </div>
          </aside>

          <div className="space-y-6">
            <div className="rounded-2xl border border-[#2d1e09] bg-linear-to-br from-[#1b1208] to-[#090706] p-4 sm:p-6 lg:p-8">
              <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
                <div>
                  <p className="uppercase tracking-[0.35em] text-[#d4a24d] text-xs font-semibold">
                    Dashboard overview
                  </p>
                  <h2 className="mt-3 text-3xl font-serif text-white">
                    Event performance snapshot
                  </h2>
                  <p className="mt-2 max-w-2xl text-gray-400">
                    Monitor attendance, revenue, and guest flow in real time.
                  </p>
                </div>

                <div className="rounded-2xl border border-[#3a240d] bg-[#15110b] px-4 py-3 text-left sm:text-right">
                  <p className="text-xs uppercase tracking-[0.3em] text-gray-500">
                    Capacity
                  </p>
                  <p className="mt-1 text-2xl font-semibold text-[#e7bc67]">
                    {stats.checkedIn}/{60}
                  </p>
                </div>
              </div>
            </div>

            <div className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
              <Card title="Tickets Sold" value={stats.totalTickets} subtitle="of 60" />
              <Card title="Remaining" value={stats.remainingTickets} subtitle="tickets" />
              <Card title="Checked In" value={stats.checkedIn} subtitle="guests" />
              <Card
                title="Revenue"
                value={new Intl.NumberFormat("en-NG", {
                  style: "currency",
                  currency: "NGN",
                }).format(stats.revenue)}
                subtitle="collected"
              />
            </div>

            <div className="grid gap-6 lg:grid-cols-[1.2fr_0.8fr]">
              <div className="bg-[#0b0907] border border-[#2d1e09] rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="uppercase tracking-[0.3em] text-[#d4a24d] text-xs font-semibold">
                      Capacity
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">Venue readiness</h3>
                  </div>
                  <span className="text-sm text-[#d4a24d]">{capacityPercent}%</span>
                </div>

                <div className="mt-6 flex items-center gap-1 text-xl tracking-[0.2em] text-[#d4a24d]">
                  {Array.from({ length: 20 }).map((_, index) => (
                    <span key={index}>{index < Math.round(capacityPercent / 5) ? "█" : "░"}</span>
                  ))}
                </div>

                <div className="mt-5 text-2xl font-semibold text-white">
                  {stats.checkedIn} / 60
                </div>

                <div className="mt-2 text-sm text-gray-400">
                  {stats.remainingTickets} seats remaining
                </div>
              </div>

              <div className="space-y-6">
                <div className="bg-[#0b0907] border border-[#2d1e09] rounded-2xl p-6">
                  <p className="uppercase tracking-[0.3em] text-[#d4a24d] text-xs font-semibold">
                    Recent check-ins
                  </p>
                  <div className="mt-4 space-y-3">
                    {recentCheckins.length > 0 ? (
                      recentCheckins.map((person) => (
                        <div key={person.id} className="flex items-center justify-between rounded-xl bg-[#140f0a] px-3 py-2">
                          <div>
                            <p className="text-sm text-white">{person.fullName}</p>
                            <p className="text-xs text-gray-500">{person.ticketType}</p>
                          </div>
                          <span className="text-xs text-[#d4a24d]">Live</span>
                        </div>
                      ))
                    ) : (
                      <p className="text-sm text-gray-500">No recent arrivals.</p>
                    )}
                  </div>
                </div>

                <div className="bg-[#0b0907] border border-[#2d1e09] rounded-2xl p-6">
                  <p className="uppercase tracking-[0.3em] text-[#d4a24d] text-xs font-semibold">
                    Event activity
                  </p>

                  <div className="mt-4 space-y-4">
                    {[
                      { time: "09:15", title: "John Doe registered", detail: "New attendee joined the guest list" },
                      { time: "09:20", title: "Mary checked in", detail: "Guest confirmed at the venue" },
                      { time: "09:32", title: "VIP Ticket sold", detail: "Premium admission was purchased" },
                      { time: "09:41", title: "PDF exported", detail: "Guest list export completed" },
                    ].map((item, index) => (
                      <div key={item.time + item.title}>
                        <div className="flex items-start gap-3">
                          <div className="mt-1 h-2.5 w-2.5 rounded-full bg-[#d4a24d]" />
                          <div className="flex-1">
                            <p className="text-sm text-[#f1ca7b]">{item.time}</p>
                            <p className="mt-1 text-sm font-medium text-white">{item.title}</p>
                            <p className="mt-1 text-xs text-gray-500">{item.detail}</p>
                          </div>
                        </div>
                        {index < 3 && <div className="mt-4 h-px bg-[#1f160f]" />}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>

            <div className="grid gap-6 xl:grid-cols-3">
              <div className="bg-[#0b0907] border border-[#2d1e09] rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="uppercase tracking-[0.3em] text-[#d4a24d] text-xs font-semibold">
                      Revenue
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">Sales trend</h3>
                  </div>
                  <span className="text-sm text-[#f1ca7b]">
                    {new Intl.NumberFormat("en-NG", {
                      style: "currency",
                      currency: "NGN",
                      maximumFractionDigits: 0,
                    }).format(stats.revenue)}
                  </span>
                </div>

                <div className="mt-5 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <AreaChart data={revenueSeries}>
                      <defs>
                        <linearGradient id="revenueFill" x1="0" y1="0" x2="0" y2="1">
                          <stop offset="5%" stopColor="#d4a24d" stopOpacity={0.7} />
                          <stop offset="95%" stopColor="#d4a24d" stopOpacity={0.05} />
                        </linearGradient>
                      </defs>
                      <CartesianGrid stroke="#2b1b0d" vertical={false} />
                      <XAxis dataKey="name" tickLine={false} axisLine={false} tick={{ fill: "#7c7c7c", fontSize: 12 }} />
                      <YAxis hide />
                      <Tooltip formatter={(value) => [new Intl.NumberFormat("en-NG", { style: "currency", currency: "NGN", maximumFractionDigits: 0 }).format(value), "Revenue"]} />
                      <Area type="monotone" dataKey="revenue" stroke="#d4a24d" fillOpacity={1} fill="url(#revenueFill)" />
                    </AreaChart>
                  </ResponsiveContainer>
                </div>
              </div>

              <div className="bg-[#0b0907] border border-[#2d1e09] rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="uppercase tracking-[0.3em] text-[#d4a24d] text-xs font-semibold">
                      VIP vs Regular
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">Audience mix</h3>
                  </div>
                  <span className="text-sm text-[#f1ca7b]">{attendees.length} guests</span>
                </div>

                <div className="mt-5 h-48">
                  <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                      <Pie data={distributionData} dataKey="value" innerRadius={55} outerRadius={80} paddingAngle={3}>
                        {distributionData.map((entry) => (
                          <Cell key={entry.name} fill={entry.color} />
                        ))}
                      </Pie>
                      <Tooltip formatter={(value) => [`${value} guests`, "Count"]} />
                    </PieChart>
                  </ResponsiveContainer>
                </div>

                <div className="space-y-2 mt-2">
                  {distributionData.map((entry) => (
                    <div key={entry.name} className="flex items-center justify-between text-sm text-gray-400">
                      <span className="flex items-center gap-2">
                        <span className="h-2.5 w-2.5 rounded-full" style={{ backgroundColor: entry.color }} />
                        {entry.name}
                      </span>
                      <span className="text-white">{entry.value}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="bg-[#0b0907] border border-[#2d1e09] rounded-2xl p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="uppercase tracking-[0.3em] text-[#d4a24d] text-xs font-semibold">
                      Check-in %
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">Attendance rate</h3>
                  </div>
                  <span className="text-sm text-[#f1ca7b]">{checkInPercent}%</span>
                </div>

                <div className="mt-5 flex h-48 items-center justify-center">
                  <ResponsiveContainer width="100%" height="100%">
                    <RadialBarChart innerRadius="70%" outerRadius="100%" data={checkInData} startAngle={180} endAngle={0}>
                      <RadialBar background clockWise dataKey="value" cornerRadius={999} fill="#d4a24d" />
                    </RadialBarChart>
                  </ResponsiveContainer>
                </div>

                <div className="-mt-10 text-center">
                  <p className="text-4xl font-semibold text-[#e7bc67]">{checkInPercent}%</p>
                  <p className="mt-2 text-sm text-gray-400">{stats.checkedIn} of 60 guests checked in</p>
                </div>
              </div>
            </div>

            <div className="bg-[#0b0907] border border-[#2d1e09] rounded-2xl overflow-hidden">
              <div className="border-b border-[#1b1208] p-4 sm:p-5">
                <div className="flex flex-col items-center gap-4 text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
                  <div>
                    <p className="uppercase tracking-[0.3em] text-[#d4a24d] text-xs font-semibold">
                      Recent check-ins
                    </p>
                    <h3 className="mt-2 text-xl font-semibold text-white">Manage arrivals</h3>
                  </div>

                  <div className="flex w-full flex-col items-stretch gap-3 sm:flex-row sm:flex-wrap sm:justify-center lg:w-auto lg:justify-start">
                    <input
                      value={search}
                      onChange={(e) => setSearch(e.target.value)}
                      placeholder="Search name, email, phone..."
                      className="h-12 flex-1 rounded-lg border border-[#24190d] bg-[#19130d] px-4 text-white outline-none focus:border-[#d4a24d] sm:h-14 sm:px-5"
                    />

                    <select
                      value={filter}
                      onChange={(e) => setFilter(e.target.value)}
                      className="h-12 rounded-lg border border-[#24190d] bg-[#19130d] px-4 text-white sm:h-14 sm:px-5"
                    >
                      <option value="ALL">All</option>
                      <option value="VIP">VIP</option>
                      <option value="REGULAR">Regular</option>
                    </select>

                    <button
                      onClick={() => downloadFile("excel")}
                      className="h-12 rounded-lg border border-[#d4a24d] px-5 text-sm uppercase tracking-[0.2em] text-[#d4a24d] sm:h-14 sm:px-7"
                    >
                      Export Excel
                    </button>

                    <button
                      onClick={() => downloadFile("pdf")}
                      className="h-12 rounded-lg border border-[#d4a24d] px-5 text-sm uppercase tracking-[0.2em] text-[#d4a24d] sm:h-14 sm:px-7"
                    >
                      Export PDF
                    </button>
                  </div>
                </div>
              </div>

              <div className="overflow-x-auto">
                <table className="w-full min-w-195 sm:min-w-180">
                  <thead className="text-left text-xs uppercase text-gray-500">
                    <tr>
                      <th className="p-2 text-center text-xs sm:p-5 sm:text-base">Ticket</th>
                      <th className="p-2 text-center text-xs sm:p-5 sm:text-base">Name</th>
                      <th className="p-2 text-center text-xs sm:p-5 sm:text-base">Email</th>
                      <th className="p-2 text-center text-xs sm:p-5 sm:text-base">Phone</th>
                      <th className="p-2 text-center text-xs sm:p-5 sm:text-base">Payment</th>
                      <th className="p-2 text-center text-xs sm:p-5 sm:text-base">Reference</th>
                      <th className="p-2 text-center text-xs sm:p-5 sm:text-base">Check-in</th>
                    </tr>
                  </thead>

                  <tbody>
                    {filteredAttendees.map((person) => (
                      <tr
                        key={person.id}
                        onClick={() => setSelectedAttendee(person)}
                        className="cursor-pointer border-t border-[#1b1208] transition hover:bg-[#120d08]"
                      >
                        <td className="p-2 text-center text-xs sm:p-5 sm:text-base">
                          <span
                            className={`rounded-full px-2 py-1 text-[10px] font-bold sm:px-3 sm:text-sm ${
                              person.ticketType === "VIP"
                                ? "bg-[#d4a24d] text-black"
                                : "bg-gray-700"
                            }`}
                          >
                            {person.ticketType}
                          </span>
                        </td>

                        <td className="max-w-27.5 wrap-break-word text-center text-xs sm:max-w-none sm:text-base">{person.fullName}</td>
                        <td className="max-w-35 wrap-break-word text-center text-xs sm:max-w-none sm:text-base">{person.email}</td>
                        <td className="max-w-25 wrap-break-word text-center text-xs sm:max-w-none sm:text-base">{person.phone}</td>
                        <td className="text-center text-xs sm:text-base">{person.paymentStatus}</td>
                        <td className="text-center text-xs text-[#d4a24d] sm:text-base">
                          {person.reference?.slice(0, 8)}...
                        </td>
                        <td className="text-center text-xs sm:text-base">{person.checkedIn ? "Checked In" : "Waiting"}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

      {selectedAttendee && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 p-3 sm:p-6">
          <div className="max-h-[90vh] w-full max-w-xl overflow-y-auto rounded-2xl border border-[#d4a24d] bg-[#0b0907]">
            <div className="flex items-center justify-between border-b border-[#2d1e09] p-4 sm:p-6">
              <h2 className="text-3xl font-serif text-[#d4a24d]">
                Attendee Details
              </h2>

              <button
                onClick={() => setSelectedAttendee(null)}
                className="text-gray-400 hover:text-white text-2xl"
              >
                ×
              </button>
            </div>

            <div className="space-y-5 p-4 sm:p-8">
              <Detail label="Full Name" value={selectedAttendee.fullName} />
              <Detail label="Email" value={selectedAttendee.email} />
              <Detail label="Phone" value={selectedAttendee.phone} />
              <Detail label="Ticket" value={selectedAttendee.ticketType} />
              <Detail label="Reference" value={selectedAttendee.reference} />
              <Detail label="Payment" value={selectedAttendee.paymentStatus} />
              <Detail label="Checked In" value={selectedAttendee.checkedIn ? "Yes" : "No"} />

              <Detail
                label="Registered On"
                value={new Date(selectedAttendee.createdAt).toLocaleString("en-NG")}
              />

              {selectedAttendee.qrCode && (
                <div className="pt-6 flex justify-center">
                  <img
                    src={`http://localhost:5000${selectedAttendee.qrCode}`}
                    alt="QR Code"
                    className="w-56 border border-[#d4a24d] rounded-xl bg-white p-3"
                  />
                </div>
              )}

              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:gap-4">
                <button
                  onClick={handleDownloadTicket}
                  className="flex-1 rounded-lg bg-[#d4a24d] py-3 font-semibold text-black"
                >
                  Download Ticket
                </button>

                <button
                  onClick={() => resendTicket(selectedAttendee.reference)}
                  disabled={sendingEmail}
                  className="
                    flex-1
                    rounded-lg
                    border
                    border-[#d4a24d]
                    py-3
                    text-[#d4a24d]
                    transition
                    hover:bg-[#d4a24d]
                    hover:text-black
                    disabled:cursor-not-allowed
                    disabled:opacity-50
                  "
                >
                  {sendingEmail ? "Sending..." : "Resend Email"}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}

function Detail({ label, value }) {
  return (
    <div>
      <p className="text-gray-500 uppercase text-xs">{label}</p>
      <p className="break-all">{value}</p>
    </div>
  );
}

function Card({ title, value, subtitle }) {
  return (
    <div className="rounded-2xl border border-[#2d1e09] bg-[#0c0906] p-6 transition hover:border-[#d4a24d] sm:p-8">
      <p className="uppercase tracking-[0.45em] text-[#d4a24d] text-xs font-semibold">
        {title}
      </p>

      <h2 className="mt-7 text-3xl font-serif text-[#e7bc67] sm:text-4xl lg:text-5xl">
        {value}
      </h2>

      <p className="mt-3 text-gray-500">{subtitle}</p>
    </div>
  );
}

