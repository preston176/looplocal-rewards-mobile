import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    ScrollView,
    TextInput,
    TouchableOpacity,
    Alert,
} from 'react-native';
import { Search, User, Star, Calendar, ArrowUpRight } from 'lucide-react-native';
import { useBusinessStore } from '@/store/businessStore';
import { Card } from '@/components/Card';
import { Badge } from '@/components/Badge';
import { colors } from '@/constants/colors';

// Mock customer data
const MOCK_CUSTOMERS = [
    {
        id: 'c1',
        name: 'John Smith',
        phoneNumber: '(123) 456-7890',
        points: 120,
        visits: 8,
        lastVisit: '2023-05-20T14:30:00Z',
        isVIP: true,
    },
    {
        id: 'c2',
        name: 'Sarah Johnson',
        phoneNumber: '(234) 567-8901',
        points: 85,
        visits: 6,
        lastVisit: '2023-05-18T11:15:00Z',
        isVIP: false,
    },
    {
        id: 'c3',
        name: 'Michael Brown',
        phoneNumber: '(345) 678-9012',
        points: 210,
        visits: 14,
        lastVisit: '2023-05-22T09:45:00Z',
        isVIP: true,
    },
    {
        id: 'c4',
        name: 'Emily Davis',
        phoneNumber: '(456) 789-0123',
        points: 45,
        visits: 3,
        lastVisit: '2023-05-10T16:20:00Z',
        isVIP: false,
    },
    {
        id: 'c5',
        name: 'David Wilson',
        phoneNumber: '(567) 890-1234',
        points: 150,
        visits: 10,
        lastVisit: '2023-05-21T13:00:00Z',
        isVIP: true,
    },
];

export default function CustomersScreen() {
    const { currentBusiness, getTopCustomers } = useBusinessStore();

    const [searchQuery, setSearchQuery] = useState('');
    const [customers, setCustomers] = useState(MOCK_CUSTOMERS);
    const [filteredCustomers, setFilteredCustomers] = useState(MOCK_CUSTOMERS);
    const [sortBy, setSortBy] = useState<'name' | 'points' | 'visits' | 'recent'>('recent');

    useEffect(() => {
        // Filter customers based on search query
        const filtered = customers.filter(customer =>
            customer.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
            customer.phoneNumber.includes(searchQuery)
        );

        // Sort customers based on selected sort option
        const sorted = [...filtered].sort((a, b) => {
            switch (sortBy) {
                case 'name':
                    return a.name.localeCompare(b.name);
                case 'points':
                    return b.points - a.points;
                case 'visits':
                    return b.visits - a.visits;
                case 'recent':
                    return new Date(b.lastVisit).getTime() - new Date(a.lastVisit).getTime();
                default:
                    return 0;
            }
        });

        setFilteredCustomers(sorted);
    }, [searchQuery, customers, sortBy]);

    const formatDate = (dateString: string) => {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
        });
    };

    const handleCustomerPress = (customer: any) => {
        // In a real app, this would navigate to the customer details screen
        Alert.alert(
            customer.name,
            `Phone: ${customer.phoneNumber}\nPoints: ${customer.points}\nVisits: ${customer.visits}\nLast Visit: ${formatDate(customer.lastVisit)}`,
            [{ text: 'OK' }]
        );
    };

    return (
        <View style={styles.container}>
            <View style={styles.searchContainer}>
                <View style={styles.searchInputContainer}>
                    <Search size={20} color={colors.textLight} style={styles.searchIcon} />
                    <TextInput
                        style={styles.searchInput}
                        placeholder="Search customers..."
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                        placeholderTextColor={colors.textLight}
                    />
                </View>
            </View>

            <View style={styles.sortContainer}>
                <Text style={styles.sortLabel}>Sort by:</Text>
                <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.sortOptions}>
                    <TouchableOpacity
                        style={[styles.sortOption, sortBy === 'recent' && styles.activeSortOption]}
                        onPress={() => setSortBy('recent')}
                    >
                        <Text style={[styles.sortText, sortBy === 'recent' && styles.activeSortText]}>Recent</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.sortOption, sortBy === 'name' && styles.activeSortOption]}
                        onPress={() => setSortBy('name')}
                    >
                        <Text style={[styles.sortText, sortBy === 'name' && styles.activeSortText]}>Name</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.sortOption, sortBy === 'points' && styles.activeSortOption]}
                        onPress={() => setSortBy('points')}
                    >
                        <Text style={[styles.sortText, sortBy === 'points' && styles.activeSortText]}>Points</Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.sortOption, sortBy === 'visits' && styles.activeSortOption]}
                        onPress={() => setSortBy('visits')}
                    >
                        <Text style={[styles.sortText, sortBy === 'visits' && styles.activeSortText]}>Visits</Text>
                    </TouchableOpacity>
                </ScrollView>
            </View>

            <ScrollView contentContainerStyle={styles.scrollContent}>
                {filteredCustomers.length > 0 ? (
                    filteredCustomers.map((customer) => (
                        <TouchableOpacity
                            key={customer.id}
                            style={styles.customerCard}
                            onPress={() => handleCustomerPress(customer)}
                            activeOpacity={0.7}
                        >
                            <View style={styles.customerHeader}>
                                <View style={styles.customerAvatar}>
                                    <User size={20} color={colors.textLight} />
                                </View>

                                <View style={styles.customerInfo}>
                                    <Text style={styles.customerName}>{customer.name}</Text>
                                    <Text style={styles.customerPhone}>{customer.phoneNumber}</Text>
                                </View>

                                {customer.isVIP && (
                                    <Badge label="VIP" variant="primary" size="small" />
                                )}
                            </View>

                            <View style={styles.customerStats}>
                                <View style={styles.statItem}>
                                    <Star size={16} color={colors.primary} />
                                    <Text style={styles.statValue}>{customer.points}</Text>
                                    <Text style={styles.statLabel}>Points</Text>
                                </View>

                                <View style={styles.statItem}>
                                    <Calendar size={16} color={colors.secondary} />
                                    <Text style={styles.statValue}>{customer.visits}</Text>
                                    <Text style={styles.statLabel}>Visits</Text>
                                </View>

                                <View style={styles.statItem}>
                                    <ArrowUpRight size={16} color={colors.textLight} />
                                    <Text style={styles.statValue}>{formatDate(customer.lastVisit)}</Text>
                                    <Text style={styles.statLabel}>Last Visit</Text>
                                </View>
                            </View>
                        </TouchableOpacity>
                    ))
                ) : (
                    <Card style={styles.emptyCard}>
                        <Text style={styles.emptyText}>No customers found</Text>
                    </Card>
                )}
            </ScrollView>
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: colors.background,
    },
    searchContainer: {
        padding: 16,
        paddingBottom: 8,
        backgroundColor: colors.card,
    },
    searchInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        backgroundColor: colors.background,
        borderRadius: 8,
        paddingHorizontal: 12,
    },
    searchIcon: {
        marginRight: 8,
    },
    searchInput: {
        flex: 1,
        height: 40,
        color: colors.text,
        fontSize: 16,
    },
    sortContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        backgroundColor: colors.card,
    },
    sortLabel: {
        fontSize: 14,
        color: colors.textLight,
        marginRight: 8,
    },
    sortOptions: {
        paddingRight: 16,
    },
    sortOption: {
        paddingHorizontal: 12,
        paddingVertical: 6,
        borderRadius: 16,
        marginRight: 8,
        backgroundColor: colors.background,
    },
    activeSortOption: {
        backgroundColor: colors.primaryLight,
    },
    sortText: {
        fontSize: 14,
        color: colors.textLight,
    },
    activeSortText: {
        color: colors.primary,
        fontWeight: '600',
    },
    scrollContent: {
        padding: 16,
        paddingBottom: 32,
    },
    customerCard: {
        backgroundColor: colors.card,
        borderRadius: 12,
        padding: 16,
        marginBottom: 12,
        borderWidth: 1,
        borderColor: colors.border,
    },
    customerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    customerAvatar: {
        width: 40,
        height: 40,
        borderRadius: 20,
        backgroundColor: colors.background,
        justifyContent: 'center',
        alignItems: 'center',
        marginRight: 12,
    },
    customerInfo: {
        flex: 1,
    },
    customerName: {
        fontSize: 16,
        fontWeight: '600',
        color: colors.textDark,
        marginBottom: 2,
    },
    customerPhone: {
        fontSize: 14,
        color: colors.textLight,
    },
    customerStats: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        backgroundColor: colors.background,
        borderRadius: 8,
        padding: 12,
    },
    statItem: {
        alignItems: 'center',
    },
    statValue: {
        fontSize: 14,
        fontWeight: '600',
        color: colors.textDark,
        marginTop: 4,
        marginBottom: 2,
    },
    statLabel: {
        fontSize: 12,
        color: colors.textLight,
    },
    emptyCard: {
        padding: 24,
        alignItems: 'center',
        justifyContent: 'center',
    },
    emptyText: {
        fontSize: 16,
        color: colors.textLight,
        fontStyle: 'italic',
    },
});