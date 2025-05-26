import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TouchableOpacity,
    Dimensions,
} from 'react-native';
import { useBusinessStore } from '@/store/businessStore';
import { Card } from '@/components/Card';
import { StatCard } from '@/components/StatCard';
import { colors } from '@/constants/colors';
import { Calendar, TrendingUp, Users, Clock } from 'lucide-react-native';

const { width } = Dimensions.get('window');

// Mock data for charts
const DAILY_DATA = [10, 15, 8, 12, 20, 18, 25];
const WEEKLY_DATA = [45, 60, 75, 90, 80, 95, 110];
const MONTHLY_DATA = [150, 200, 180, 220, 250, 230, 270, 290, 310, 280, 320, 350];

// Mock data for top customers
const TOP_CUSTOMERS = [
    { id: 'c1', name: 'John Smith', checkIns: 14 },
    { id: 'c2', name: 'Sarah Johnson', checkIns: 12 },
    { id: 'c3', name: 'Michael Brown', checkIns: 10 },
    { id: 'c4', name: 'Emily Davis', checkIns: 8 },
    { id: 'c5', name: 'David Wilson', checkIns: 7 },
];

export default function AnalyticsScreen() {
    const { currentBusiness, getCheckInsForPeriod } = useBusinessStore();

    const [timeframe, setTimeframe] = useState<'day' | 'week' | 'month'>('week');

    const getTimeframeData = () => {
        switch (timeframe) {
            case 'day':
                return DAILY_DATA;
            case 'week':
                return WEEKLY_DATA;
            case 'month':
                return MONTHLY_DATA;
        }
    };

    const getTimeframeLabels = () => {
        switch (timeframe) {
            case 'day':
                return ['9AM', '10AM', '11AM', '12PM', '1PM', '2PM', '3PM'];
            case 'week':
                return ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
            case 'month':
                return ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
        }
    };

    const renderBarChart = () => {
        const data = getTimeframeData();
        const labels = getTimeframeLabels();
        const maxValue = Math.max(...data);

        return (
            <View style={styles.chartContainer}>
                <View style={styles.barsContainer}>
                    {data.map((value, index) => (
                        <View key={index} style={styles.barColumn}>
                            <View
                                style={[
                                    styles.bar,
                                    {
                                        height: (value / maxValue) * 150,
                                        backgroundColor: value === maxValue ? colors.primary : colors.primaryLight,
                                    }
                                ]}
                            />
                            <Text style={styles.barLabel}>{labels[index]}</Text>
                        </View>
                    ))}
                </View>

                <View style={styles.chartYAxis}>
                    <Text style={styles.yAxisLabel}>{maxValue}</Text>
                    <Text style={styles.yAxisLabel}>{Math.round(maxValue / 2)}</Text>
                    <Text style={styles.yAxisLabel}>0</Text>
                </View>
            </View>
        );
    };

    return (
        <View style={styles.container}>
            <ScrollView contentContainerStyle={styles.scrollContent}>
                {/* Stats Overview */}
                <View style={styles.statsGrid}>
                    <StatCard
                        title="Today's Check-ins"
                        value={getCheckInsForPeriod('day').length || DAILY_DATA[DAILY_DATA.length - 1]}
                        icon={<Users size={24} color={colors.primary} />}
                    />

                    <StatCard
                        title="This Week"
                        value={getCheckInsForPeriod('week').length || WEEKLY_DATA.reduce((a, b) => a + b, 0)}
                        icon={<Calendar size={24} color={colors.secondary} />}
                        color={colors.secondary}
                    />
                </View>

                {/* Chart */}
                <Card variant="elevated" style={styles.chartCard}>
                    <View style={styles.chartHeader}>
                        <Text style={styles.chartTitle}>Check-in Analytics</Text>

                        <View style={styles.timeframeButtons}>
                            <TouchableOpacity
                                style={[styles.timeframeButton, timeframe === 'day' && styles.activeTimeframeButton]}
                                onPress={() => setTimeframe('day')}
                            >
                                <Text style={[styles.timeframeButtonText, timeframe === 'day' && styles.activeTimeframeButtonText]}>
                                    Day
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.timeframeButton, timeframe === 'week' && styles.activeTimeframeButton]}
                                onPress={() => setTimeframe('week')}
                            >
                                <Text style={[styles.timeframeButtonText, timeframe === 'week' && styles.activeTimeframeButtonText]}>
                                    Week
                                </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                                style={[styles.timeframeButton, timeframe === 'month' && styles.activeTimeframeButton]}
                                onPress={() => setTimeframe('month')}
                            >
                                <Text style={[styles.timeframeButtonText, timeframe === 'month' && styles.activeTimeframeButtonText]}>
                                    Month
                                </Text>
                            </TouchableOpacity>
                        </View>
                    </View>

                    {renderBarChart()}

                    <View style={styles.chartFooter}>
                        <View style={styles.chartStat}>
                            <Text style={styles.chartStatValue}>
                                {timeframe === 'day'
                                    ? DAILY_DATA.reduce((a, b) => a + b, 0)
                                    : timeframe === 'week'
                                        ? WEEKLY_DATA.reduce((a, b) => a + b, 0)
                                        : MONTHLY_DATA.reduce((a, b) => a + b, 0)
                                }
                            </Text>
                            <Text style={styles.chartStatLabel}>Total Check-ins</Text>
                        </View>

                        <View style={styles.chartStat}>
                            <Text style={styles.chartStatValue}>
                                {timeframe === 'day'
                                    ? Math.round(DAILY_DATA.reduce((a, b) => a + b, 0) / DAILY_DATA.length)
                                    : timeframe === 'week'
                                        ? Math.round(WEEKLY_DATA.reduce((a, b) => a + b, 0) / WEEKLY_DATA.length)
                                        : Math.round(MONTHLY_DATA.reduce((a, b) => a + b, 0) / MONTHLY_DATA.length)
                                }
                            </Text>
                            <Text style={styles.chartStatLabel}>Average per {timeframe}</Text>
                        </View>

                        <View style={styles.chartStat}>
                            <Text style={styles.chartStatValue}>
                                {timeframe === 'day'
                                    ? Math.max(...DAILY_DATA)
                                    : timeframe === 'week'
                                        ? Math.max(...WEEKLY_DATA)
                                        : Math.max(...MONTHLY_DATA)
                                }
                            </Text>
                            <Text style={styles.chartStatLabel}>Peak</Text>
                        </View>
                    </View>
                </Card>

                {/* Top Customers */}
                <Text style={styles.sectionTitle}>Top Customers</Text>
                <Card style={styles.topCustomersCard}>
                    {TOP_CUSTOMERS.map((customer, index) => (
                        <View key={customer.id} style={styles.customerRow}>
                            <View style={styles.customerRank}>
                                <Text style={styles.rankText}>{index + 1}</Text>
                            </View>

                            <Text style={styles.customerName}>{customer.name}</Text>

                            <View style={styles.checkInsContainer}>
                                <Text style={styles.checkInsValue}>{customer.checkIns}</Text>
                                <Text style={styles.checkInsLabel}>check-ins</Text>
                            </View>
                        </View>
                    ))}
                </Card>

                {/* Export Data */}
                <Card style={styles.exportCard}>
                    <Text style={styles.exportTitle}>Export Analytics</Text>
                    <Text style={styles.exportDescription}>
                        Download your analytics data for further analysis or reporting.
                    </Text>

                    <View style={styles.exportButtons}>
                        <TouchableOpacity
                            style={styles.exportButton}
                            onPress={() => {
                                // In a real app, this would export data as CSV
                                alert('Exporting as CSV...');
                            }}
                        >
                            <Text style={styles.exportButtonText}>Export as CSV</Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={styles.exportButton}
                            onPress={() => {
                                // In a real app, this would export data as JSON
                                alert('Exporting as JSON...');
                            }}
                        >
                            <Text style={styles.exportButtonText}>Export as JSON</Text>
                        </TouchableOpacity>
                    </View>
                </Card>
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    statsGrid: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        marginBottom: 16,
    },
    chartCard: {
        padding: 16,
        marginBottom: 24,
    },
    chartHeader: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 16,
    },
    chartTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textDark,
    },
    timeframeButtons: {
        flexDirection: 'row',
        backgroundColor: colors.background,
        borderRadius: 8,
        overflow: 'hidden',
    },
    timeframeButton: {
        paddingHorizontal: 12,
        paddingVertical: 6,
    },
    activeTimeframeButton: {
        backgroundColor: colors.primary,
    },
    timeframeButtonText: {
        fontSize: 14,
        color: colors.textLight,
    },
    activeTimeframeButtonText: {
        color: 'white',
        fontWeight: '600',
    },
    chartContainer: {
        flexDirection: 'row',
        height: 180,
        marginBottom: 16,
    },
    chartYAxis: {
        width: 30,
        justifyContent: 'space-between',
        alignItems: 'flex-end',
        paddingVertical: 10,
    },
    yAxisLabel: {
        fontSize: 12,
        color: colors.textLight,
    },
    barsContainer: {
        flex: 1,
        flexDirection: 'row',
        alignItems: 'flex-end',
        justifyContent: 'space-around',
        paddingVertical: 10,
    },
    barColumn: {
        alignItems: 'center',
    },
    bar: {
        width: 20,
        borderRadius: 4,
        marginBottom: 8,
    },
    barLabel: {
        fontSize: 12,
        color: colors.textLight,
    },
    chartFooter: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        borderTopWidth: 1,
        borderTopColor: colors.border,
        paddingTop: 16,
    },
    chartStat: {
        alignItems: 'center',
    },
    chartStatValue: {
        fontSize: 18,
        fontWeight: 'bold',
        color: colors.textDark,
        marginBottom: 4,
    },
    chartStatLabel: {
        fontSize: 12,
        color: colors.textLight,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: 16,
    },
    topCustomersCard: {
        padding: 0,
        marginBottom: 24,
    },
    customerRow: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderBottomWidth: 1,
        borderBottomColor: colors.border,
    },
    customerRank: {
        width: 24,
        height: 24,
        borderRadius: 12,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    rankText: {
        fontSize: 12,
        fontWeight: 'bold',
        color: colors.textDark,
    },
    customerName: {
        flex: 1,
        fontSize: 16,
        color: colors.text,
    },
    checkInsContainer: {
        alignItems: 'flex-end',
    },
    checkInsValue: {
        fontSize: 16,
        fontWeight: 'bold',
        color: colors.primary,
    },
    checkInsLabel: {
        fontSize: 12,
        color: colors.textLight,
    },
    exportCard: {
        padding: 16,
    },
    exportTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: 8,
    },
    exportDescription: {
        fontSize: 14,
        color: colors.text,
        marginBottom: 16,
    },
    exportButtons: {
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    exportButton: {
        backgroundColor: colors.background,
        paddingVertical: 10,
        paddingHorizontal: 16,
        borderRadius: 8,
        borderWidth: 1,
        borderColor: colors.border,
        width: '48%',
        alignItems: 'center',
    },
    exportButtonText: {
        fontSize: 14,
        color: colors.textDark,
        fontWeight: '500',
    },
});