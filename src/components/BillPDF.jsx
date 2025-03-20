import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

// Define styles for the PDF
const styles = StyleSheet.create({
  page: {
    flexDirection: 'column',
    padding: 20,
  },
  header: {
    fontSize: 24,
    marginBottom: 10,
    textAlign: 'center',
  },
  tableInfo: {
    fontSize: 16,
    marginBottom: 10,
  },
  orderDetails: {
    fontSize: 14,
    marginBottom: 10,
  },
  totalAmount: {
    fontSize: 18,
    fontWeight: 'bold',
    marginTop: 10,
  },
});

const BillPDF = ({ table }) => (
  <Document>
    <Page size="A4" style={styles.page}>
      <View>
        <Text style={styles.header}>FlavorFusion Restaurant</Text>
        <Text style={styles.tableInfo}>Table Number: {table.tableNumber}</Text>
        <Text style={styles.tableInfo}>Capacity: {table.capacity}</Text>
        <Text style={styles.orderDetails}>Order: {table.order}</Text>
        <Text style={styles.totalAmount}>Total Amount: ${table.billAmount.toFixed(2)}</Text>
      </View>
    </Page>
  </Document>
);

export default BillPDF;