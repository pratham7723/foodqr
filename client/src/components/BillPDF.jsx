import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    backgroundColor: '#FFFFFF',
    padding: 30,
    fontFamily: 'Helvetica',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    borderBottomWidth: 2,
    borderBottomColor: '#F97316',
    borderBottomStyle: 'solid',
    paddingBottom: 10,
    marginBottom: 20,
  },
  restaurantName: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#F97316',
  },
  invoiceInfo: {
    fontSize: 12,
    textAlign: 'right',
  },
  customerSection: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  customerInfo: {
    width: '48%',
  },
  tableInfo: {
    width: '48%',
  },
  infoBox: {
    borderWidth: 1,
    borderColor: '#E5E7EB',
    borderRadius: 4,
    padding: 10,
  },
  sectionTitle: {
    fontSize: 14,
    fontWeight: 'bold',
    marginBottom: 8,
    color: '#374151',
  },
  infoRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 4,
  },
  infoLabel: {
    fontSize: 12,
    fontWeight: 'bold',
    width: '40%',
  },
  infoValue: {
    fontSize: 12,
    width: '60%',
  },
  itemsHeader: {
    flexDirection: 'row',
    borderBottomWidth: 1,
    borderBottomColor: '#E5E7EB',
    borderBottomStyle: 'solid',
    paddingBottom: 5,
    marginBottom: 5,
  },
  itemRow: {
    flexDirection: 'row',
    marginBottom: 5,
  },
  itemCol: {
    fontSize: 10,
  },
  col1: { width: '10%' },
  col2: { width: '50%' },
  col3: { width: '20%', textAlign: 'right' },
  col4: { width: '20%', textAlign: 'right' },
  totalSection: {
    flexDirection: 'row',
    justifyContent: 'flex-end',
    marginTop: 20,
    borderTopWidth: 1,
    borderTopColor: '#E5E7EB',
    borderTopStyle: 'solid',
    paddingTop: 10,
  },
  totalLabel: {
    fontSize: 14,
    fontWeight: 'bold',
    marginRight: 20,
  },
  totalAmount: {
    fontSize: 16,
    fontWeight: 'bold',
    color: '#F97316',
  },
  footer: {
    position: 'absolute',
    bottom: 30,
    left: 0,
    right: 0,
    textAlign: 'center',
    fontSize: 10,
    color: '#6B7280',
  },
});

const formatINR = (amount) => {
  return new Intl.NumberFormat('en-IN', {
    style: 'currency',
    currency: 'INR',
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(amount);
};

const BillPDF = ({ table, customer }) => {
  const now = new Date();
  const dateStr = now.toLocaleDateString('en-IN');
  const timeStr = now.toLocaleTimeString('en-IN', {
    hour: '2-digit',
    minute: '2-digit',
  });

  // Parse order items
  const orderItems = table.order.split(', ').map((item, index) => {
    const [quantity, ...nameParts] = item.split(' ');
    const name = nameParts.join(' ');
    const price = table.billAmount / table.order.split(', ').length;
    return {
      id: index + 1,
      name,
      quantity: parseInt(quantity),
      price,
      total: price * parseInt(quantity),
    };
  });

  return (
    <Document>
      <Page size="A4" style={styles.page}>
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.restaurantName}>FlavorFusion</Text>
            <Text>Nana Mauva,Rajkot</Text>
            <Text>GSTIN: 22ABCDE1234F1Z5</Text>
          </View>
          <View style={styles.invoiceInfo}>
            <Text>Invoice #: {table.id.slice(-6).toUpperCase()}</Text>
            <Text>Date: {dateStr}</Text>
            <Text>Time: {timeStr}</Text>
          </View>
        </View>

        {/* Customer and Table Information */}
        <View style={styles.customerSection}>
          {/* Customer Details */}
          <View style={styles.customerInfo}>
            <Text style={styles.sectionTitle}>Customer Details</Text>
            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Name:</Text>
                <Text style={styles.infoValue}>{customer.name}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Phone:</Text>
                <Text style={styles.infoValue}>{customer.phone}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Order Type:</Text>
                <Text style={styles.infoValue}>Dine-in</Text>
              </View>
            </View>
          </View>

          {/* Table Details */}
          <View style={styles.tableInfo}>
            <Text style={styles.sectionTitle}>Table Details</Text>
            <View style={styles.infoBox}>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Table No:</Text>
                <Text style={styles.infoValue}>{table.tableNumber}</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Capacity:</Text>
                <Text style={styles.infoValue}>{table.capacity} persons</Text>
              </View>
              <View style={styles.infoRow}>
                <Text style={styles.infoLabel}>Status:</Text>
                <Text style={styles.infoValue}>{table.status}</Text>
              </View>
            </View>
          </View>
        </View>

        {/* Order Items */}
        <View>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          <View style={styles.itemsHeader}>
            <Text style={[styles.itemCol, styles.col1]}>#</Text>
            <Text style={[styles.itemCol, styles.col2]}>Item</Text>
            <Text style={[styles.itemCol, styles.col3]}>Price</Text>
            <Text style={[styles.itemCol, styles.col4]}>Amount</Text>
          </View>
          
          {orderItems.map((item) => (
            <View key={item.id} style={styles.itemRow}>
              <Text style={[styles.itemCol, styles.col1]}>{item.id}</Text>
              <Text style={[styles.itemCol, styles.col2]}>{item.name}</Text>
              <Text style={[styles.itemCol, styles.col3]}>{formatINR(item.price)}</Text>
              <Text style={[styles.itemCol, styles.col4]}>{formatINR(item.total)}</Text>
            </View>
          ))}
        </View>

        {/* Total Amount */}
        <View style={styles.totalSection}>
          <Text style={styles.totalLabel}>Total Amount:</Text>
          <Text style={styles.totalAmount}>{formatINR(table.billAmount)}</Text>
        </View>

        {/* Footer */}
        <View style={styles.footer}>
          <Text>Thank you for dining with us!</Text>
          <Text>For feedback: feedback@flavorfusion.com | Phone: +91 7016498352</Text>
        </View>
      </Page>
    </Document>
  );
};

export default BillPDF;