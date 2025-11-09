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
