package ru.neoflex.depositcalculator.controller;

import jakarta.validation.Valid;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;
import ru.neoflex.depositcalculator.dto.DepositCalculationRequest;
import ru.neoflex.depositcalculator.dto.DepositCalculationResponse;
import ru.neoflex.depositcalculator.service.DepositCalculationService;

@RestController
@RequestMapping("/api")
public class DepositCalculationController {

    private final DepositCalculationService calculationService;

    public DepositCalculationController(DepositCalculationService calculationService) {
        this.calculationService = calculationService;
    }

    @PostMapping("/calculate")
    public ResponseEntity<DepositCalculationResponse> calculate(
            @Valid @RequestBody DepositCalculationRequest request
    ) {
        return ResponseEntity.ok(calculationService.calculate(request));
    }
}
