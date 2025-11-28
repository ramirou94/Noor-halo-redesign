import React, { useEffect } from 'react';
import { View, StyleSheet, Dimensions } from 'react-native';
import Animated, {
    useSharedValue,
    useAnimatedStyle,
    withRepeat,
    withSequence,
    withTiming,
    withSpring,
    Easing,
} from 'react-native-reanimated';
import { Canvas, Circle, Group, LinearGradient, vec, BlurMask } from '@shopify/react-native-skia';
import { colors } from '../styles/theme';

interface CelestialOrbProps {
    size?: number;
    variant?: 'aurora' | 'moonlight' | 'starfield';
    animated?: boolean;
}

export const CelestialOrb: React.FC<CelestialOrbProps> = ({
    size = 300,
    variant = 'aurora',
    animated = true,
}) => {
    const rotation = useSharedValue(0);
    const scale = useSharedValue(1);
    const blur = useSharedValue(30);

    useEffect(() => {
        if (animated) {
            // Rotation lente
            rotation.value = withRepeat(
                withTiming(360, { duration: 20000, easing: Easing.linear }),
                -1,
                false
            );

            // Pulsation organique
            scale.value = withRepeat(
                withSequence(
                    withSpring(1.1, { damping: 10, stiffness: 50 }),
                    withSpring(0.95, { damping: 10, stiffness: 50 }),
                    withSpring(1, { damping: 10, stiffness: 50 })
                ),
                -1,
                true
            );

            // Blur dynamique
            blur.value = withRepeat(
                withSequence(
                    withTiming(40, { duration: 4000, easing: Easing.inOut(Easing.ease) }),
                    withTiming(30, { duration: 4000, easing: Easing.inOut(Easing.ease) })
                ),
                -1,
                true
            );
        }
    }, [animated]);

    const animatedStyle = useAnimatedStyle(() => ({
        transform: [
            { rotate: `${rotation.value}deg` },
            { scale: scale.value },
        ],
    }));

    const getGradientColors = () => {
        switch (variant) {
            case 'moonlight':
                return colors.gradients.moonlight;
            case 'starfield':
                return colors.gradients.starfield;
            default:
                return colors.gradients.aurora;
        }
    };

    return (
        <View style={[styles.container, { width: size, height: size }]}>
            <Animated.View style={[animatedStyle, { width: size, height: size }]}>
                <Canvas style={{ width: size, height: size }}>
                    <Group>
                        {/* Cercle principal */}
                        <Circle cx={size / 2} cy={size / 2} r={size / 2.5}>
                            <LinearGradient
                                start={vec(0, 0)}
                                end={vec(size, size)}
                                colors={getGradientColors()}
                            />
                            <BlurMask blur={blur} style="normal" />
                        </Circle>

                        {/* Particules (3 petits cercles) */}
                        {[0, 120, 240].map((angle, index) => {
                            const x = size / 2 + Math.cos((angle * Math.PI) / 180) * (size / 3.5);
                            const y = size / 2 + Math.sin((angle * Math.PI) / 180) * (size / 3.5);

                            return (
                                <Circle key={index} cx={x} cy={y} r={size / 8} opacity={0.6}>
                                    <LinearGradient
                                        start={vec(x - 20, y - 20)}
                                        end={vec(x + 20, y + 20)}
                                        colors={[colors.auroraTeal, colors.stellarBlue]}
                                    />
                                    <BlurMask blur={15} style="normal" />
                                </Circle>
                            );
                        })}
                    </Group>
                </Canvas>
            </Animated.View>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        alignItems: 'center',
        justifyContent: 'center',
    },
});
