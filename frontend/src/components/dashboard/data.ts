export type Company = {
  id: string
  name: string
  location: string
}

export const companies: Company[] = [
  { id: "acme", name: "Acme Co.", location: "Palo Alto, CA" },
  { id: "facebook", name: "Facebook", location: "San Francisco, CA" },
  { id: "instagram", name: "Instagram", location: "Austin, TX" },
  { id: "twitter", name: "Twitter", location: "Brooklyn, NY" },
]

export type NavSection = {
  title: string
  items: Array<
    | {
        type: "link"
        label: string
        href?: string
        icon: string
        isActive?: boolean
      }
    | {
        type: "collapsible"
        label: string
        icon: string
        items: string[]
      }
  >
}

export const navSections: NavSection[] = [
  {
    title: "Main Menu",
    items: [
      { type: "link", label: "Students", icon: "Users", href: "/dashboard/students" },
      { type: "link", label: "Payments", icon: "CreditCard", href: "/dashboard/payments" },
      // pruned per requirement: remove Balances, Customers, Products, Reports
    ],
  },
  {
    title: "General",
    items: [
      { type: "link", label: "Developers", icon: "Code2", href: "/dashboard/developers" },
      { type: "link", label: "Settings", icon: "Settings", href: "/dashboard/settings" },
    ],
  },
  {
    title: "Updates",
    items: [{ type: "link", label: "Changelog", icon: "History", href: "/dashboard/changelog" }],
  },
]

export const balanceCards = [
  {
    title: "Auto Insurance",
    subtitle: "1311 Cars",
    value: "$45,910",
    trend: "+ 4.5%",
    trendColor: "text-emerald-400",
    background: "from-blue-600 to-indigo-600 text-white",
    stats: [
      { label: "100,930 USD", icon: "arrow-down", color: "text-emerald-400" },
      { label: "54,120 USD", icon: "arrow-up", color: "text-rose-400" },
      { label: "125 VIP", icon: "star", color: "text-emerald-400" },
    ],
  },
  {
    title: "Health Insurance",
    subtitle: "+2400 People",
    value: "$12,138",
    trend: "+ 4.5%",
    trendColor: "text-rose-500",
    background: "from-slate-50 to-slate-100 text-foreground",
    stats: [
      { label: "11,930 USD", icon: "arrow-down", color: "text-emerald-500" },
      { label: "54,120 USD", icon: "arrow-up", color: "text-rose-500" },
      { label: "150 VIP", icon: "star", color: "text-emerald-500" },
    ],
  },
  {
    title: "Balance Insurance",
    subtitle: "1311 Cars",
    value: "$3,910",
    trend: "+ 4.5%",
    trendColor: "text-rose-400",
    background: "from-emerald-500 to-emerald-600 text-white",
    stats: [
      { label: "100,930 USD", icon: "arrow-down", color: "text-rose-200" },
      { label: "54,120 USD", icon: "arrow-up", color: "text-rose-200" },
      { label: "125 VIP", icon: "star", color: "text-emerald-200" },
    ],
  },
]

export const agents = [
  "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  "https://i.pravatar.cc/150?u=a04258114e29026702d",
  "https://i.pravatar.cc/150?u=a048581f4e29026701d",
  "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
]

export const transactions = [
  {
    name: "Jose Perez",
    amount: "4500 USD",
    date: "9/20/2021",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
  },
  {
    name: "Andrew Steven",
    amount: "4500 USD",
    date: "9/20/2021",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
  },
  {
    name: "Ruben Garcia",
    amount: "1500 USD",
    date: "2/20/2022",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
  },
  {
    name: "Perla Garcia",
    amount: "200 USD",
    date: "3/20/2022",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
  },
  {
    name: "Mathew Funez",
    amount: "2444 USD",
    date: "5/20/2022",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
  },
  {
    name: "Carlos Diaz",
    amount: "3000 USD",
    date: "12/20/2022",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d2",
  },
]

export const usersTable = [
  {
    id: 1,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    contactNo: "555-0101",
    studentClass: "Class 12",
    batch: "A",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 2,
    name: "Zoey Lang",
    role: "Technical Lead",
    team: "Development",
    status: "inactive",
    contactNo: "555-0102",
    studentClass: "Class 11",
    batch: "B",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  {
    id: 3,
    name: "Jane Fisher",
    role: "Senior Developer",
    team: "Development",
    status: "active",
    contactNo: "555-0103",
    studentClass: "Class 10",
    batch: "C",
    age: "22",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
  },
  {
    id: 4,
    name: "William Howard",
    role: "Community Manager",
    team: "Marketing",
    status: "inactive",
    contactNo: "555-0104",
    studentClass: "Class 12",
    batch: "A",
    age: "28",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "william.howard@example.com",
  },
  {
    id: 5,
    name: "Kristen Copper",
    role: "Sales Manager",
    team: "Sales",
    status: "active",
    contactNo: "555-0105",
    studentClass: "Class 11",
    batch: "B",
    age: "24",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
  },
  {
    id: 6,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    contactNo: "555-0106",
    studentClass: "Class 10",
    batch: "C",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 7,
    name: "Zoey Lang",
    role: "Technical Lead",
    team: "Development",
    status: "inactive",
    contactNo: "555-0107",
    studentClass: "Class 12",
    batch: "A",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  {
    id: 8,
    name: "Jane Fisher",
    role: "Senior Developer",
    team: "Development",
    status: "active",
    contactNo: "555-0108",
    studentClass: "Class 11",
    batch: "B",
    age: "22",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
  },
  {
    id: 9,
    name: "William Howard",
    role: "Community Manager",
    team: "Marketing",
    status: "inactive",
    contactNo: "555-0109",
    studentClass: "Class 10",
    batch: "C",
    age: "28",
    avatar: "https://i.pravatar.cc/150?u=a048581f4e29026701d",
    email: "william.howard@example.com",
  },
  {
    id: 10,
    name: "Kristen Copper",
    role: "Sales Manager",
    team: "Sales",
    status: "active",
    contactNo: "555-0110",
    studentClass: "Class 12",
    batch: "A",
    age: "24",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
  },
  {
    id: 11,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    contactNo: "555-0111",
    studentClass: "Class 11",
    batch: "B",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 12,
    name: "Kristen Copper",
    role: "Sales Manager",
    team: "Sales",
    status: "active",
    contactNo: "555-0112",
    studentClass: "Class 10",
    batch: "C",
    age: "24",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
  },
  {
    id: 13,
    name: "Jane Fisher",
    role: "Senior Developer",
    team: "Development",
    status: "active",
    contactNo: "555-0113",
    studentClass: "Class 12",
    batch: "A",
    age: "22",
    avatar: "https://i.pravatar.cc/150?u=a04258114e29026702d",
    email: "jane.fisher@example.com",
  },
  {
    id: 14,
    name: "Zoey Lang",
    role: "Technical Lead",
    team: "Development",
    status: "inactive",
    contactNo: "555-0114",
    studentClass: "Class 11",
    batch: "B",
    age: "25",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026704d",
    email: "zoey.lang@example.com",
  },
  {
    id: 15,
    name: "Tony Reichert",
    role: "CEO",
    team: "Management",
    status: "active",
    contactNo: "555-0115",
    studentClass: "Class 10",
    batch: "C",
    age: "29",
    avatar: "https://i.pravatar.cc/150?u=a042581f4e29026024d",
    email: "tony.reichert@example.com",
  },
  {
    id: 16,
    name: "Kristen Copper",
    role: "Sales Manager",
    team: "Sales",
    status: "active",
    contactNo: "555-0116",
    studentClass: "Class 12",
    batch: "A",
    age: "24",
    avatar: "https://i.pravatar.cc/150?u=a092581d4ef9026700d",
    email: "kristen.cooper@example.com",
  },
]

export type PaymentRecord = {
  id: number
  invoice: string
  studentId: string
  studentName: string
  studentEmail: string
  avatar: string
  amount: number
  date: string
  status: string
  method: string
  reference: string
}

export const paymentsTable: PaymentRecord[] = [
  {
    id: 101,
    invoice: "INV-2024-001",
    studentId: "ST-2001",
    studentName: "Arif Hossain",
    studentEmail: "arif.hossain@example.com",
    avatar: "https://i.pravatar.cc/150?u=pay_user_1",
    amount: 1450,
    date: "2024-11-05",
    status: "paid",
    method: "bKash",
    reference: "TXN-34981",
  },
  {
    id: 102,
    invoice: "INV-2024-002",
    studentId: "ST-2004",
    studentName: "Nafisa Rahman",
    studentEmail: "nafisa.rahman@example.com",
    avatar: "https://i.pravatar.cc/150?u=pay_user_2",
    amount: 1325,
    date: "2024-11-04",
    status: "paid",
    method: "Nagad",
    reference: "TXN-34975",
  },
  {
    id: 103,
    invoice: "INV-2024-003",
    studentId: "ST-2012",
    studentName: "Ishan Ahmed",
    studentEmail: "ishan.ahmed@example.com",
    avatar: "https://i.pravatar.cc/150?u=pay_user_3",
    amount: 980,
    date: "2024-11-03",
    status: "pending",
    method: "Bank Transfer",
    reference: "TXN-34960",
  },
  {
    id: 104,
    invoice: "INV-2024-004",
    studentId: "ST-1998",
    studentName: "Tasnim Haque",
    studentEmail: "tasnim.haque@example.com",
    avatar: "https://i.pravatar.cc/150?u=pay_user_4",
    amount: 1580,
    date: "2024-11-01",
    status: "overdue",
    method: "Card",
    reference: "TXN-34925",
  },
  {
    id: 105,
    invoice: "INV-2024-005",
    studentId: "ST-1985",
    studentName: "Mahmud Hasan",
    studentEmail: "mahmud.hasan@example.com",
    avatar: "https://i.pravatar.cc/150?u=pay_user_5",
    amount: 1200,
    date: "2024-10-28",
    status: "paid",
    method: "Rocket",
    reference: "TXN-34888",
  },
  {
    id: 106,
    invoice: "INV-2024-006",
    studentId: "ST-1992",
    studentName: "Sadia Karim",
    studentEmail: "sadia.karim@example.com",
    avatar: "https://i.pravatar.cc/150?u=pay_user_6",
    amount: 1325,
    date: "2024-10-27",
    status: "pending",
    method: "Card",
    reference: "TXN-34874",
  },
  {
    id: 107,
    invoice: "INV-2024-007",
    studentId: "ST-2018",
    studentName: "Rehan Chowdhury",
    studentEmail: "rehan.chowdhury@example.com",
    avatar: "https://i.pravatar.cc/150?u=pay_user_7",
    amount: 990,
    date: "2024-10-25",
    status: "paid",
    method: "Nagad",
    reference: "TXN-34830",
  },
  {
    id: 108,
    invoice: "INV-2024-008",
    studentId: "ST-2020",
    studentName: "Maira Jahan",
    studentEmail: "maira.jahan@example.com",
    avatar: "https://i.pravatar.cc/150?u=pay_user_8",
    amount: 1100,
    date: "2024-10-23",
    status: "overdue",
    method: "bKash",
    reference: "TXN-34792",
  },
  {
    id: 109,
    invoice: "INV-2024-009",
    studentId: "ST-2008",
    studentName: "Faiaz Rahim",
    studentEmail: "faiaz.rahim@example.com",
    avatar: "https://i.pravatar.cc/150?u=pay_user_9",
    amount: 1420,
    date: "2024-10-20",
    status: "paid",
    method: "Bank Transfer",
    reference: "TXN-34740",
  },
  {
    id: 110,
    invoice: "INV-2024-010",
    studentId: "ST-1979",
    studentName: "Nadim Khan",
    studentEmail: "nadim.khan@example.com",
    avatar: "https://i.pravatar.cc/150?u=pay_user_10",
    amount: 1250,
    date: "2024-10-18",
    status: "failed",
    method: "Card",
    reference: "TXN-34712",
  },
]

export const chartData = [
  { year: "1991", series1: 31, series2: 11 },
  { year: "1992", series1: 40, series2: 32 },
  { year: "1993", series1: 28, series2: 45 },
  { year: "1994", series1: 51, series2: 32 },
  { year: "1995", series1: 42, series2: 34 },
  { year: "1996", series1: 109, series2: 52 },
  { year: "1997", series1: 100, series2: 41 },
]

export const chartConfig = {
  series1: {
    label: "Series 1",
    color: "hsl(221 83% 53%)",
  },
  series2: {
    label: "Series 2",
    color: "hsl(281 67% 55%)",
  },
}
