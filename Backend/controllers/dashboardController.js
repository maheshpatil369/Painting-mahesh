const Order = require('../models/order');
const Product = require('../models/product');
const User = require('../models/user');

// GET dashboard KPIs (admin only)
async function getKPIs(req, res) {
  try {
    const currentYear = new Date().getFullYear();
    const startOfYear = new Date(currentYear, 0, 1);
    
    // Total Revenue (YTD)
    const ordersYTD = await Order.find({
      createdAt: { $gte: startOfYear },
      status: { $in: ['PAID', 'SHIPPED', 'COMPLETED'] }
    });
    const totalRevenue = ordersYTD.reduce((sum, order) => sum + order.total, 0);
    
    // Orders Processed (YTD)
    const ordersProcessed = ordersYTD.length;
    
    // New Customers (YTD)
    const newCustomers = await User.countDocuments({
      createdAt: { $gte: startOfYear },
      role: 'CUSTOMER'
    });
    
    // Inventory Value (sum of all products * stock * price)
    const products = await Product.find();
    const inventoryValue = products.reduce((sum, product) => {
      return sum + (product.price * (product.stock || 0));
    }, 0);
    
    // Calculate trends (comparing with previous period)
    const previousYearStart = new Date(currentYear - 1, 0, 1);
    const previousYearEnd = new Date(currentYear - 1, 11, 31, 23, 59, 59);
    
    const prevOrders = await Order.find({
      createdAt: { $gte: previousYearStart, $lte: previousYearEnd },
      status: { $in: ['PAID', 'SHIPPED', 'COMPLETED'] }
    });
    const prevRevenue = prevOrders.reduce((sum, order) => sum + order.total, 0);
    const prevCustomers = await User.countDocuments({
      createdAt: { $gte: previousYearStart, $lte: previousYearEnd },
      role: 'CUSTOMER'
    });
    
    const revenueTrend = prevRevenue > 0 
      ? Math.round(((totalRevenue - prevRevenue) / prevRevenue) * 100) 
      : 0;
    const ordersTrend = prevOrders.length > 0
      ? Math.round(((ordersProcessed - prevOrders.length) / prevOrders.length) * 100)
      : 0;
    const customersTrend = prevCustomers > 0
      ? Math.round(((newCustomers - prevCustomers) / prevCustomers) * 100)
      : 0;
    
    // Format values
    const formatCurrency = (amount) => {
      if (amount >= 10000000) return `₹${(amount / 10000000).toFixed(1)} Cr`;
      if (amount >= 100000) return `₹${(amount / 100000).toFixed(1)} Lakh`;
      return `₹${amount.toLocaleString()}`;
    };
    
    res.json({
      kpis: [
        {
          id: 'revenue',
          title: 'Total Revenue (YTD)',
          value: formatCurrency(totalRevenue),
          trend: revenueTrend
        },
        {
          id: 'orders',
          title: 'Orders Processed',
          value: ordersProcessed.toString(),
          trend: ordersTrend
        },
        {
          id: 'customers',
          title: 'New Customers',
          value: newCustomers.toString(),
          trend: customersTrend
        },
        {
          id: 'inventory',
          title: 'Inventory Value',
          value: formatCurrency(inventoryValue),
          trend: 0
        }
      ]
    });
  } catch (error) {
    console.error('Error fetching KPIs:', error);
    res.status(500).json({ message: 'Failed to fetch dashboard KPIs' });
  }
}

// GET sales history (monthly data for chart) (admin only)
async function getSalesHistory(req, res) {
  try {
    const currentYear = new Date().getFullYear();
    const monthlySales = [];
    
    // Get sales for each month of current year
    for (let month = 0; month < 12; month++) {
      const monthStart = new Date(currentYear, month, 1);
      const monthEnd = new Date(currentYear, month + 1, 0, 23, 59, 59);
      
      const orders = await Order.find({
        createdAt: { $gte: monthStart, $lte: monthEnd },
        status: { $in: ['PAID', 'SHIPPED', 'COMPLETED'] }
      });
      
      const monthRevenue = orders.reduce((sum, order) => sum + order.total, 0);
      // Convert to lakhs (divide by 100000)
      monthlySales.push(Math.round(monthRevenue / 100000));
    }
    
    res.json({ history: monthlySales });
  } catch (error) {
    console.error('Error fetching sales history:', error);
    res.status(500).json({ message: 'Failed to fetch sales history' });
  }
}

module.exports = {
  getKPIs,
  getSalesHistory
};

