package ru.neoflex.depositcalculator.service;

import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import ru.neoflex.depositcalculator.dto.DepositCalculationRequest;
import ru.neoflex.depositcalculator.dto.DepositCalculationResponse;

import java.math.BigDecimal;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.junit.jupiter.api.Assertions.assertThrows;

class DepositCalculationServiceTest {

    private DepositCalculationService service;

    @BeforeEach
    void setUp() {
        service = new DepositCalculationService();
    }

    @Test
    void shouldCalculateDepositAtEightPercent() {
        DepositCalculationResponse response = service.calculate(request("100000", 12, "8"));

        assertEquals(new BigDecimal("108299.95"), response.total());
        assertEquals(new BigDecimal("8299.95"), response.profit());
    }

    @Test
    void shouldCalculateDepositWithFractionalRate() {
        DepositCalculationResponse response = service.calculate(request("100000", 12, "8.5"));

        assertEquals(new BigDecimal("108839.09"), response.total());
        assertEquals(new BigDecimal("8839.09"), response.profit());
    }

    @Test
    void shouldRoundResultToTwoDecimalPlaces() {
        DepositCalculationResponse response = service.calculate(request("1000", 1, "1"));

        assertEquals(new BigDecimal("1000.83"), response.total());
        assertEquals(new BigDecimal("0.83"), response.profit());
    }

    @Test
    void shouldRejectNullRequest() {
        assertThrows(NullPointerException.class, () -> service.calculate(null));
    }

    private DepositCalculationRequest request(String amount, int months, String rate) {
        return new DepositCalculationRequest(
                new BigDecimal(amount),
                months,
                new BigDecimal(rate)
        );
    }
}
