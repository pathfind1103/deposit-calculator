package ru.neoflex.depositcalculator.controller;

import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.webmvc.test.autoconfigure.WebMvcTest;
import org.springframework.http.MediaType;
import org.springframework.test.context.bean.override.mockito.MockitoBean;
import org.springframework.test.web.servlet.MockMvc;
import ru.neoflex.depositcalculator.dto.DepositCalculationRequest;
import ru.neoflex.depositcalculator.dto.DepositCalculationResponse;
import ru.neoflex.depositcalculator.service.DepositCalculationService;

import java.math.BigDecimal;

import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.when;
import static org.springframework.test.web.servlet.request.MockMvcRequestBuilders.post;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.jsonPath;
import static org.springframework.test.web.servlet.result.MockMvcResultMatchers.status;

@WebMvcTest(DepositCalculationController.class)
class DepositCalculationControllerTest {

    @Autowired
    private MockMvc mockMvc;

    @MockitoBean
    private DepositCalculationService calculationService;

    @Test
    void shouldReturnCalculationResultForValidRequest() throws Exception {
        when(calculationService.calculate(any(DepositCalculationRequest.class)))
                .thenReturn(response("108299.95", "8299.95"));

        mockMvc.perform(post("/api/calculate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {
                                  "amount": 100000,
                                  "months": 12,
                                  "rate": 8
                                }
                                """))
                .andExpect(status().isOk())
                .andExpect(jsonPath("$.total").value(108299.95))
                .andExpect(jsonPath("$.profit").value(8299.95));
    }

    @Test
    void shouldAcceptInclusiveBoundaryValues() throws Exception {
        when(calculationService.calculate(any(DepositCalculationRequest.class)))
                .thenReturn(response("1000.83", "0.83"));

        mockMvc.perform(post("/api/calculate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"amount": 1000, "months": 1, "rate": 1}
                                """))
                .andExpect(status().isOk());

        mockMvc.perform(post("/api/calculate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"amount": 10000000, "months": 60, "rate": 20}
                                """))
                .andExpect(status().isOk());
    }

    @Test
    void shouldReturnValidationErrorsForValuesBelowMinimum() throws Exception {
        mockMvc.perform(post("/api/calculate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"amount": 999.99, "months": 0, "rate": 0.99}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Validation failed"))
                .andExpect(jsonPath("$.fieldErrors.amount").exists())
                .andExpect(jsonPath("$.fieldErrors.months").exists())
                .andExpect(jsonPath("$.fieldErrors.rate").exists());
    }

    @Test
    void shouldReturnValidationErrorsForValuesAboveMaximum() throws Exception {
        mockMvc.perform(post("/api/calculate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("""
                                {"amount": 10000000.01, "months": 61, "rate": 20.01}
                                """))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.amount").exists())
                .andExpect(jsonPath("$.fieldErrors.months").exists())
                .andExpect(jsonPath("$.fieldErrors.rate").exists());
    }

    @Test
    void shouldReturnValidationErrorsForMissingFields() throws Exception {
        mockMvc.perform(post("/api/calculate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{}"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.fieldErrors.amount").exists())
                .andExpect(jsonPath("$.fieldErrors.months").exists())
                .andExpect(jsonPath("$.fieldErrors.rate").exists());
    }

    @Test
    void shouldReturnBadRequestForMalformedJson() throws Exception {
        mockMvc.perform(post("/api/calculate")
                        .contentType(MediaType.APPLICATION_JSON)
                        .content("{\"amount\":"))
                .andExpect(status().isBadRequest())
                .andExpect(jsonPath("$.error").value("Malformed request"));
    }

    private DepositCalculationResponse response(String total, String profit) {
        return new DepositCalculationResponse(new BigDecimal(total), new BigDecimal(profit));
    }
}
